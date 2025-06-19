import { Schema, Types, model, models } from "mongoose";

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String },
	provider: {
		type: String,
		enum: ["credentials", "google"],
		required: true,
	},
	bookmarks: [{ type: Types.ObjectId, ref: "Story" }],
});

const User = models.User || model("User", UserSchema);
export default User;
