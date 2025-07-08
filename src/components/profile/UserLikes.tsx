"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { BaseStory } from "@/models/story.model";

export default function UserLikes({ userId }: { userId: string }) {
	const [stories, setStories] = useState<BaseStory[]>([]);

	useEffect(() => {
		const fetchStories = async () => {
			const res = await fetch(`/api/users/likes`);
			const data = await res.json();
			setStories(data.likes);
		};
		fetchStories();
	}, [userId]);

	if (!stories.length) return <p>Henüz hikaye beğenmediniz.</p>;

	return (
		<Carousel
			opts={{ align: "start" }}
			orientation="horizontal"
			className="w-full"
		>
			<CarouselContent className="-ml-4 h-full">
				{stories.map((story) => (
					<CarouselItem
						key={story._id}
						className="basis-1/2.5 lg:basis-1/3.5 xl:basis-1/4.5 h-full"
					>
						<Card>
							<CardContent className="p-4">
								<p className="font-semibold">{story.title}</p>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Link href={`/stories/${story._id}`}>
									<Button variant="outline">Görüntüle</Button>
								</Link>
							</CardFooter>
						</Card>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
