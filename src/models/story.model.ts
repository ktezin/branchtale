import { model, models, Schema } from "mongoose";

type Choice = {
	text: string;
	nextSceneId: string;
};

type Scene = {
	id: string;
	text: string;
	choices: Choice[];
};

const StorySchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	startSceneId: {
		type: String,
		required: true,
	},
	scenes: [
		{
			id: {
				type: String,
				required: true,
			},
			text: {
				type: String,
				required: true,
			},
			choices: [
				{
					text: {
						type: String,
						required: true,
					},
					nextSceneId: {
						type: String,
						required: true,
					},
				},
			],
		},
	],
	createdAt: {
		type: Date,
		required: true,
	},
	updatedAt: {
		type: Date,
		required: true,
	},
});

const StoryModel = models.Story || model("Story", StorySchema);

export default StoryModel;
