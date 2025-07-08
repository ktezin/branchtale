import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/mongodb";
import StoryModel, { BaseStory } from "@/models/story.model";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
		}

		await connectToDatabase();

		const likedStories: BaseStory[] = await StoryModel.find(
			{ likes: session.user.id },
			{ title: 1, description: 1, createdAt: 1, createdBy: 1 }
		)
			.sort({ createdAt: -1 })
			.exec();

		return NextResponse.json({ likes: likedStories }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}
