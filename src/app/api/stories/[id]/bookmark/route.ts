import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import { ObjectId } from "mongodb";

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
		}

		const userId = session.user.id;
		const { id } = await params;

		const db = await connectToDatabase();
		if (!db) throw new Error("Veritabanı bağlantısı başarısız");

		const user = await UserModel.findById(userId);
		if (!user) {
			return NextResponse.json(
				{ error: "Kullanıcı bulunamadı" },
				{ status: 404 }
			);
		}

		const storyObjectId = new ObjectId(id);
		const alreadyBookmarked = user.bookmarks?.some((id: any) =>
			id.equals(storyObjectId)
		);

		if (alreadyBookmarked) {
			user.bookmarks = user.bookmarks.filter(
				(id: any) => !id.equals(storyObjectId)
			);
		} else {
			user.bookmarks = [...(user.bookmarks || []), storyObjectId];
		}

		await user.save();

		return NextResponse.json(
			{ bookmarked: !alreadyBookmarked },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Bookmark hatası:", error);
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}
