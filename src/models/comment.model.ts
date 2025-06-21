import { model, models, Schema, Types } from "mongoose";

export type Comment = {
	_id: Types.ObjectId;
	storyId: Types.ObjectId;
	userId: Types.ObjectId;
	content: string;
	createdAt: Date;
	updatedAt: Date;
};

const CommentSchema = new Schema(
	{
		storyId: { type: Types.ObjectId, ref: "Story", required: true },
		userId: { type: Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

export default models.Comment || model("Comment", CommentSchema);
