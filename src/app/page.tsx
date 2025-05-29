import StoryCard from "@/components/StoryCard";
import { Story } from "@/models/story.model";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Home() {
	const lastRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories?sort=createdBy&limit=10`
	);

	if (!lastRes.ok) return notFound();

	const lastCreated: Story[] = await lastRes.json();

	const updatedRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories?sort=updatedBy&limit=10`
	);

	if (!updatedRes.ok) return notFound();

	const lastUpdated: Story[] = await updatedRes.json();

	return (
		<div className="mx-[20vw] py-8 flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h3 className="font-bold text-2xl text-gray-900">
					Son Yazılan Hikayeler
				</h3>
				<div className="flex gap-4">
					{lastCreated.map((story) => (
						<StoryCard key={story._id} id={story._id} title={story.title} />
					))}
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<h3 className="font-bold text-2xl text-gray-900">
					Son Güncellenen Hikayeler
				</h3>
				<div className="flex gap-4">
					{lastUpdated.map((story) => (
						<StoryCard key={story._id} id={story._id} title={story.title} />
					))}
				</div>
			</div>
		</div>
	);
}
