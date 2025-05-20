import { notFound } from "next/navigation";
import SceneViewer from "@/components/SceneViewer";

interface Story {
	_id: string;
	title: string;
	startSceneId: string;
	scenes: Array<{
		id: string;
		text: string;
		choices?: Array<{
			text: string;
			nextSceneId: string;
		}>;
	}>;
}

export default async function StoryPage({
	params,
}: {
	params: Promise<{ id: string }>; // Yeni kural
}) {
	// 1. Params'ı bekle
	const { id } = await params;
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${id}`
	);

	if (!res.ok) return notFound();

	const story: Story = await res.json();

	console.log(story);

	return (
		<main className="max-w-3xl mx-auto p-4">
			<h1 className="text-4xl font-bold mb-8">{story.title}</h1>
			<SceneViewer scenes={story.scenes} initialSceneId={story.startSceneId} />
		</main>
	);
}

// 2. GenerateMetadata için ayrı async fonksiyon
/*export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${id}`
	);
	const story: Story = await res.json();

	return {
		title: `${story.title} - BranchTale`,
		description: story.scenes[0]?.text || "Interaktif hikaye deneyimi",
	};
}
*/
