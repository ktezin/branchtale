import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import CommentModel, { Comment } from "@/models/comment.model";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json(
			{ error: "Bu işlem için giriş yapmanız gerekli" },
			{ status: 401 }
		);

	const { storyId, content }: Comment = await req.json();

	if (!storyId || !content)
		return NextResponse.json({ error: "Eksik veri" }, { status: 400 });

	await connectToDatabase();

	const newComment = await CommentModel.create({
		storyId,
		userId: session.user.id,
		content,
	});

	return NextResponse.json(newComment, { status: 201 });
}

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const storyId = searchParams.get("storyId");
	const sort = searchParams.get("sort") || "createdAt";
	const order = searchParams.get("order") === "asc" ? 1 : -1;

	if (!storyId)
		return NextResponse.json({ error: "Hikaye Id gerekli" }, { status: 400 });

	await connectToDatabase();

	const comments = await CommentModel.find({ storyId })
		.populate("userId", "username image")
		.sort({ [sort]: order });

	return NextResponse.json({ comments });
}
