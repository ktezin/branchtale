import StoryCard from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
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
			<Button>hellooo</Button>
			<div className="flex flex-col gap-2">
				<h3 className="font-bold text-2xl text-gray-900 dark:text-gray-200">
					Son Yazılan Hikayeler
				</h3>

				<Carousel
					opts={{ align: "start" }}
					orientation="horizontal"
					className="w-full"
				>
					<CarouselContent className="-ml-4 h-full">
						{lastCreated.stories.map((story) => (
							<CarouselItem
								key={story._id}
								className="basis-1/2.5 lg:basis-1/3.5 xl:basis-1/4.5 h-full"
							>
								<StoryCard
									id={story._id}
									title={story.title}
									createdBy={story.createdBy.username}
								/>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
			<div className="flex flex-col gap-2">
				<h3 className="font-bold text-2xl text-gray-900 dark:text-gray-200">
					Son Güncellenen Hikayeler
				</h3>
				<Carousel
					opts={{ align: "start" }}
					orientation="horizontal"
					className="w-full"
				>
					<CarouselContent className="-ml-4 h-full">
						{lastUpdated.stories.map((story) => (
							<CarouselItem
								key={story._id}
								className="basis-1/2.5 lg:basis-1/3.5 xl:basis-1/4.5 h-full"
							>
								<StoryCard
									id={story._id}
									title={story.title}
									createdBy={story.createdBy.username}
								/>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</div>
	);
}
