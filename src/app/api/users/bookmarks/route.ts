import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/user.model";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
		}

		await connectToDatabase();

		const user = await UserModel.findById(session.user.id).populate({
			path: "bookmarks",
			select: "title createdBy createdAt updatedAt",
			populate: {
				path: "createdBy",
				select: "username",
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Kullanıcı bulunamadı" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ bookmarks: user.bookmarks }, { status: 200 });
	} catch (error) {
		console.error("Bookmark listesi hatası:", error);
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}
