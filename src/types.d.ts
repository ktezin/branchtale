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

export type SceneData = Node<{
	label: string;
	description: string;
}>;

export type SceneEdgeData = {
	optionText: string;
};

export type StoryWithAuthor = Story & {
	createdBy: {
		_id: string;
		username: string;
	};
};

export interface StoryListResponse {
	stories: StoryWithAuthor[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}
