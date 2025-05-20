import { connectToDatabase } from "@/lib/mongodb";
import StoryModel from "@/models/story.model";
import { NextRequest, NextResponse } from "next/server";

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

		const stories = await StoryModel.find({})

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
	const { title, scenes, startSceneId } = requestBody as {
		title: string;
		scenes: Scene[];
		startSceneId: string;
	};

	try {
		const dbConnection = await connectToDatabase();
		const db = dbConnection?.db;

		if (!db) {
			throw new Error("Database connection failed");
		}

		const result = await db.collection("stories").insertOne({
			title,
			scenes,
			startSceneId,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return NextResponse.json({ id: result.insertedId }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
