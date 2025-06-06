import HorizontalScroll from "@/components/HorizontalScroll";
import StoryCard from "@/components/StoryCard";
import { StoryListResponse } from "@/types";
import { notFound } from "next/navigation";

export default async function Home() {
	const lastRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories?sort=createdAt&order=desc&limit=10`
	);

	if (!lastRes.ok) return notFound();

	const lastCreated: StoryListResponse = await lastRes.json();

	const updatedRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories?sort=updatedAt&order=desc&limit=10`
	);

	if (!updatedRes.ok) return notFound();

	const lastUpdated: StoryListResponse = await updatedRes.json();

	return (
		<div className="mx-[10vw] md:mx-[15vw] lg:mx-[20vw] py-8 flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h3 className="font-bold text-2xl text-gray-900 dark:text-gray-200">
					Son Yazılan Hikayeler
				</h3>

				<HorizontalScroll>
					{lastCreated.stories.map((story) => (
						<StoryCard
							key={story._id}
							id={story._id}
							title={story.title}
							createdBy={story.createdBy.username}
						/>
					))}
				</HorizontalScroll>
			</div>
			<div className="flex flex-col gap-2">
				<h3 className="font-bold text-2xl text-gray-900 dark:text-gray-200">
					Son Güncellenen Hikayeler
				</h3>
				<HorizontalScroll>
					{lastUpdated.stories.map((story) => (
						<StoryCard
							key={story._id}
							id={story._id}
							title={story.title}
							createdBy={story.createdBy.username}
						/>
					))}
				</HorizontalScroll>
			</div>
		</div>
	);
}
