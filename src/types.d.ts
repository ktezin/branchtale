import { Session } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

export type SceneData = {
	label: string;
	description: string;
};

export type SceneEdgeData = {
	optionText: string;
};
