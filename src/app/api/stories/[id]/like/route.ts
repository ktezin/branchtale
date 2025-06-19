import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongodb";
import StoryModel from "@/models/story.model";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection?.db;

		if (!db) {
			throw new Error("Database connection failed");
		}
		const session = await getServerSession(authOptions);
		if (!session)
			return NextResponse.json(
				{ error: "Bu işlem için giriş yapmanız gerekli" },
				{ status: 401 }
			);

		const { id } = await params;

		const story = await StoryModel.findById(id);

		if (!story)
			return NextResponse.json({ error: "Hikaye bulunamadı" }, { status: 404 });

		const userId = session.user.id;

		if (!story.likes) {
			story.likes = [];
		}

		const index = story.likes.findIndex(
			(id: Types.ObjectId) => id.toString() == userId
		);

		if (index > -1) {
			story.likes.splice(index, 1);
		} else {
			story.likes.push(userId);
		}

		await story.save();

		return NextResponse.json({ likes: story.likes.length }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}
