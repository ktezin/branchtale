import StoryCard from "@/components/StoryCard";
import { Story } from "@/models/story.model";
import { StoryWithAuthor } from "@/types";
import { notFound } from "next/navigation";

export default async function Home() {
	const lastRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories?sort=createdBy&limit=10`
	);

	if (!lastRes.ok) return notFound();

	const lastCreated: StoryWithAuthor[] = await lastRes.json();

	const updatedRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories?sort=updatedBy&limit=10`
	);

	if (!updatedRes.ok) return notFound();

	const lastUpdated: StoryWithAuthor[] = await updatedRes.json();

	return (
		<div className="mx-[20vw] py-8 flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h3 className="font-bold text-2xl text-gray-900">
					Son Yazılan Hikayeler
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
					{lastCreated.map((story) => (
						<StoryCard
							key={story._id}
							id={story._id}
							title={story.title}
							createdBy={story.createdBy.username}
						/>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<h3 className="font-bold text-2xl text-gray-900">
					Son Güncellenen Hikayeler
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
					{lastUpdated.map((story) => (
						<StoryCard
							key={story._id}
							id={story._id}
							title={story.title}
							createdBy={story.createdBy.toString()}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
