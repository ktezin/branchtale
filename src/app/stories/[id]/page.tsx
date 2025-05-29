import { notFound } from "next/navigation";
import SceneViewer from "@/components/SceneViewer";
import { Story } from "@/models/story.model";

export default async function StoryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${id}`
	);

	if (!res.ok) return notFound();

	const story: Story = await res.json();

	return (
		<main className="max-w-3xl mx-auto p-4">
			<h1 className="text-4xl font-bold mb-8">{story.title}</h1>
			<SceneViewer scenes={story.scenes} initialSceneId={story.startSceneId} />
		</main>
	);
}
