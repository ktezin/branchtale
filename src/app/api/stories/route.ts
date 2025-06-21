import { connectToDatabase } from "@/lib/mongodb";
import StoryModel from "@/models/story.model";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(req.url);

		const sort = searchParams.get("sort") || "createdAt"; // createdAt, updatedAt, title, etc.
		const order = searchParams.get("order") === "asc" ? 1 : -1;
		const limit = parseInt(searchParams.get("limit") || "10");
		const page = parseInt(searchParams.get("page") || "1");
		const title = searchParams.get("title")?.toLowerCase();
		const username = searchParams.get("username");
		const category = searchParams.get("category");

		const filter: {
			title?: { $regex: string; $options: string };
			category?: string;
			createdBy?: string;
		} = {};

		if (title) {
			filter.title = { $regex: title, $options: "i" };
		}

		if (category) {
			filter.category = category;
		}
		if (username) {
			const user = await (
				await import("@/models/user.model")
			).default.findOne({
				username: username,
			});
			if (user) {
				filter.createdBy = user._id;
			} else {
				return NextResponse.json([], { status: 200 });
			}
		}

		const stories = await StoryModel.find(filter)
			.sort({ [sort]: order })
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("createdBy", "username");

		const totalCount = await StoryModel.countDocuments(filter);

		return NextResponse.json(
			{
				stories,
				pagination: {
					total: totalCount,
					page,
					limit,
					totalPages: Math.ceil(totalCount / limit),
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Sunucu hatası: " + error },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	const requestBody = await request.json();
	const { title, description, scenes, startSceneId } = requestBody;

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
			description,
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
