import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "bson";

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
