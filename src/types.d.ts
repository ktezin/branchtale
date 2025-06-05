import NextAuth from "next-auth";
import { Story } from "@/models/story.model";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}

export type SceneData = {
	label: string;
	description: string;
};

export type SceneEdgeData = {
	optionText: string;
};

export type StoryWithAuthor = Story & {
	createdBy: {
		_id: string;
		username: string;
	};
};