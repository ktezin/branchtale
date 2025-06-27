import { model, models, Schema, Types } from "mongoose";

export type CommentUser = {
	username: string;
	image: string;
};

export type Comment = {
	_id: Types.ObjectId;
	storyId: Types.ObjectId;
	userId: Types.ObjectId | CommentUser;
	content: string;
	parentComment: Types.ObjectId | null;
	replies?: Comment[];
	createdAt: Date;
	updatedAt: Date;
};

const CommentSchema = new Schema(
	{
		storyId: { type: Types.ObjectId, ref: "Story", required: true },
		userId: { type: Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
		parentComment: { type: Types.ObjectId, ref: "Comment", default: null },
	},
	{ timestamps: true }
);

export default models.Comment || model("Comment", CommentSchema);
