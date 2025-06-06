import { notFound } from "next/navigation";
import SceneViewer from "@/components/SceneViewer";
import { Story } from "@/models/story.model";
import Link from "next/link";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

export default async function ReadPage({
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
			<div className="flex items-center justify-between">
				<h1 className="text-4xl font-bold mb-8">{story.title}</h1>
				<Link href={"/stories/" + id} className="flex gap-2">
					<ArrowUturnLeftIcon width={20} />
					Geri Dön
				</Link>
			</div>
			<SceneViewer scenes={story.scenes} initialSceneId={story.startSceneId} />
		</main>
	);
}
