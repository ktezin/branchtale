import { Schema, Types, model, models } from "mongoose";

export type Choice = {
	optionText: string;
	nextSceneId: string;
};

export type Scene = {
	id: string;
	label: string;
	description: string;
	position: {
		x: number;
		y: number;
	};
	choices: Choice[];
};

export type Story = BaseStory & {
	_id: string;
	title: string;
	description: string;
	startSceneId: string;
	scenes: Scene[];
	createdBy: Schema.Types.ObjectId | string;
	likes?: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
};

export type BaseStory = {
	_id: string;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
};

const ChoiceSchema = new Schema<Choice>(
	{
		optionText: { type: String, required: true },
		nextSceneId: { type: String, required: true },
	},
	{ _id: false }
);

const SceneSchema = new Schema<Scene>(
	{
		id: { type: String, required: true },
		label: { type: String, required: true },
		description: { type: String, required: true },
		position: {
			x: { type: Number, required: true },
			y: { type: Number, required: true },
		},
		choices: { type: [ChoiceSchema], required: true },
	},
	{ _id: false }
);

const StorySchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		startSceneId: { type: String, required: true },
		scenes: { type: [SceneSchema], required: true },
		likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{
		timestamps: true,
	}
);

const StoryModel = models.Story || model("Story", StorySchema);
export default StoryModel;
