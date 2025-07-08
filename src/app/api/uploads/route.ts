import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongodb";
import { STORAGE_LIMITS } from "@/lib/storageLimits";
import Upload from "@/models/upload.model";
import User, { IUser } from "@/models/user.model";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

type MediaType = "image" | "video";

interface FilterParams {
	uploadedBy: string;
	type?: MediaType;
}

export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
		}

		const userId = session.user.id;

		await connectToDatabase();

		const searchParams = req.nextUrl.searchParams;
		const limit = parseInt(searchParams.get("limit") || "20");
		const page = parseInt(searchParams.get("page") || "1");
		const typeFilter = searchParams.get("type"); // "image" veya "video"

		const skip = (page - 1) * limit;

		const isValidMediaType = (type: string | null): type is MediaType => {
			return type === "image" || type === "video";
		};

		const filter: FilterParams = { uploadedBy: userId };
		if (typeFilter && isValidMediaType(typeFilter)) {
			filter.type = typeFilter;
		}

		const totalCount = await Upload.countDocuments(filter);

		const allUserUploads = await Upload.find({ uploadedBy: userId }).lean();
		const totalStorageMB = allUserUploads.reduce(
			(acc, upload) => acc + upload.size,
			0
		);

		const uploads = await Upload.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();

		return NextResponse.json(
			{
				uploads,
				pagination: {
					page,
					limit,
					totalCount,
					totalPages: Math.ceil(totalCount / limit),
				},
				usage: {
					totalStorageMB: Number(totalStorageMB.toFixed(2)),
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Upload listeleme hatası:", error);
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
		}

		const userId = session.user.id;

		await connectToDatabase();

		const user: IUser | null = await User.findById(userId);
		if (!user) {
			return NextResponse.json(
				{ error: "Kullanıcı bulunamadı" },
				{ status: 404 }
			);
		}

		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const sizeMB = buffer.byteLength / (1024 * 1024);
		const mimeType = file.type;

		const allowedTypes = ["image/png", "image/jpeg", "image/webp", "video/mp4"];
		if (!allowedTypes.includes(mimeType))
			return NextResponse.json(
				{ error: "Desteklenmeyen dosya türü" },
				{ status: 400 }
			);

		const type = mimeType.startsWith("video") ? "video" : "image";

		const uploads = await Upload.find({ uploadedBy: userId });
		const currentTypeTotal = uploads
			.filter((u) => u.type === type)
			.reduce((acc, u) => acc + u.size, 0);

		const limits = STORAGE_LIMITS[user.membershipType];
		const typeLimitMB =
			type === "video" ? limits.totalVideoStorage : limits.totalImageStorage;
		if (currentTypeTotal + sizeMB > typeLimitMB)
			return NextResponse.json(
				{ error: `Depolama limitiniz aşıldı (${typeLimitMB} MB)` },
				{ status: 400 }
			);

		const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
		const uploadDir = path.join(process.cwd(), "public/uploads");
		const filepath = path.join(uploadDir, filename);
		await writeFile(filepath, buffer);

		const newUpload = await Upload.create({
			url: `/uploads/${filename}`,
			size: sizeMB,
			type,
			uploadedBy: userId,
		});

		return NextResponse.json(
			{ message: "Yükleme başarılı", upload: newUpload },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Upload hatası:", error);
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}
