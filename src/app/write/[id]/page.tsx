import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import StoryModel, { Story } from "@/models/story.model";
import { transformFromScenes } from "@/lib/storyUtils";
import WriteClient from "./WriteClient";

export default async function WritePage({
	params,
}: {
	params: { id: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/login");

	const story = await StoryModel.findOne({
		_id: params.id,
		createdBy: session.user.id,
	});

	if (!story) redirect("/");

	const { nodes, edges } = transformFromScenes(story.scenes);

	return (
		<WriteClient
			title={story.title}
			initialNodes={nodes}
			initialEdges={edges}
		/>
	);
}
