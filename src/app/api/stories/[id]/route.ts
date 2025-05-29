import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "bson";
import StoryModel from "@/models/story.model";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const dbConnection = await connectToDatabase();
		const db = dbConnection?.db;

		if (!db) {
			throw new Error("Database connection failed");
		}

		const story = await db
			.collection("stories")
			.findOne({ _id: new ObjectId(id) });

		if (!story) {
			return NextResponse.json({ error: "Hikaye bulunamadı" }, { status: 404 });
		}

		return NextResponse.json(story, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const body = await request.json();
		const { title, startSceneId, scenes } = body;

		const dbConnection = await connectToDatabase();
		const db = dbConnection?.db;

		if (!db) throw new Error("Database connection failed");

		const updatedStory = await StoryModel.findByIdAndUpdate(
			id,
			{
				title,
				startSceneId,
				scenes,
			},
			{ new: true }
		);

		if (!updatedStory) {
			return NextResponse.json({ error: "Hikaye bulunamadı" }, { status: 404 });
		}

		return NextResponse.json(
			{ message: "Hikaye güncellendi.", updatedStory },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}
