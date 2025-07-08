import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongodb";
import uploadModel from "@/models/upload.model";
import { unlink } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
		}

		const userId = session.user.id;
		const { id } = await params;

		await connectToDatabase();

		const upload = await uploadModel.findById(id);
		if (!upload) {
			return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
		}

		if (upload.uploadedBy.toString() !== userId) {
			return NextResponse.json(
				{ error: "Bu dosyayı silme yetkiniz yok" },
				{ status: 403 }
			);
		}

		const filePath = path.join(process.cwd(), "public", upload.url);

		try {
			await unlink(filePath);
		} catch (fileError) {
			console.warn("Dosya fiziksel olarak silinemedi:", fileError);
		}

		await upload.deleteOne();

		return NextResponse.json(
			{ message: "Dosya başarıyla silindi" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Dosya silme hatası:", error);
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}
