import StoryCard from "@/components/StoryCard";
import { Story } from "@/models/story.model";
import { notFound } from "next/navigation";

export default async function StoryPage() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories`);

	if (!res.ok) return notFound();

	const stories: Story[] = await res.json();
	return (
		<main className="max-w-3xl mx-auto p-4">
			<div className="flex">
				{stories.map((story) => (
					<StoryCard key={story._id} id={story._id} title={story.title} createdBy={story.createdBy.toString()} />
				))}
			</div>
		</main>
	);
}
