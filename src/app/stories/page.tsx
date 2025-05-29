import Link from "next/link";
import { notFound } from "next/navigation";

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
	params: Promise<{ id: string }>;
}) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories`);

	if (!res.ok) return notFound();

	const stories: Story[] = await res.json();
	return (
		<main className="max-w-3xl mx-auto p-4">
			<div className="flex">
				{stories.map((story) => (
					<Link
						key={story._id}
						href={"/stories/" + story._id}
						className="bg-white shadow p-2 rounded-lg w-[240px] h-[240px] text"
					>
						<h1 className="text-2xl font-bold mb-8">{story.title}</h1>
						<label>{/* story description */}</label>
						Oku
					</Link>
				))}
			</div>
		</main>
	);
}
