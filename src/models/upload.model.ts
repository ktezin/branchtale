import { model, models, Schema, Types } from "mongoose";

export type UploadType = "image" | "video";

export type Upload = {
	_id: Types.ObjectId;
	url: string;
	size: number;
	duration?: number;
	width: number;
	height: number;
	type: UploadType;
	uploadedBy: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
};

const UploadSchema = new Schema(
	{
		url: { type: String, required: true },
		size: Number,
		duration: Number,
		width: Number,
		height: Number,
		type: {
			type: String,
			enum: ["image", "video"] as UploadType[],
			required: true,
		},
		uploadedBy: { type: Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

export default models.Upload || model("Upload", UploadSchema);
