import { connectToDatabase } from "@/lib/mongodb";
import StoryModel from "@/models/story.model";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

type Choice = {
	text: string;
	nextSceneId: string;
};

type Scene = {
	id: string;
	text: string;
	choices: Choice[];
};

export async function GET(request: Request) {
	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection?.db;

		if (!db) {
			throw new Error("Database connection failed");
		}

		const stories = await StoryModel.find({});

		if (!stories) {
			return NextResponse.json(
				{ error: "Henüz bir hikaye mevcut değil" },
				{ status: 404 }
			);
		}

		return NextResponse.json(stories, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	const requestBody = await request.json();
	const { title, scenes, startSceneId } = requestBody;

	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection?.db;

		if (!db) throw new Error("Database connection failed");

		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
		}

		const result = await StoryModel.create({
			title,
			scenes,
			startSceneId,
			createdBy: session.user.id,
		});

		return NextResponse.json({ id: result._id }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", details: error },
			{ status: 500 }
		);
	}
}
