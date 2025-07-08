import { Schema, Types, model, models } from "mongoose";

export interface IUser extends Document {
	username: string;
	email: string;
	password?: string;
	provider: "credentials" | "google";
	bookmarks: Types.ObjectId[];
	membershipType: "free" | "premium" | "pro";
}

const UserSchema = new Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String },
		provider: {
			type: String,
			enum: ["credentials", "google"],
			required: true,
		},
		bookmarks: [{ type: Types.ObjectId, ref: "Story" }],
		membershipType: {
			type: String,
			enum: ["free", "premium", "pro"],
			default: "free",
		},
	},
	{
		timestamps: true,
	}
);

const User = models.User || model("User", UserSchema);
export default User;
