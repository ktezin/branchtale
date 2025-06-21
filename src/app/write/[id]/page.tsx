import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { notFound, redirect } from "next/navigation";
import { Story } from "@/models/story.model";
import { transformFromScenes } from "@/lib/storyUtils";
import WriteClient from "./WriteClient";

export default async function WritePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/login");

	const { id } = await params;

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${id}`
	);

	if (!res.ok) return notFound();

	const story: Story = await res.json();

	if (!story) redirect("/");

	if (story.createdBy !== session.user.id) redirect("/");

	const { nodes, edges } = transformFromScenes(story.scenes);

	return (
		<WriteClient
			storyId={story._id}
			storyTitle={story.title}
			storyDescription={story.description}
			initialNodes={nodes}
			initialEdges={edges}
		/>
	);
}
