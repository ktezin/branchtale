"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { HeartIcon } from "@heroicons/react/24/outline";

export default function LikeButton({
	storyId,
	initialLiked,
	initialCount,
}: {
	storyId: string;
	initialLiked: boolean;
	initialCount: number;
}) {
	const [liked, setLiked] = useState(initialLiked);
	const [count, setCount] = useState(initialCount);

	const toggleLike = async () => {
		const res = await fetch(`/api/stories/${storyId}/like`, { method: "POST" });

		if (res.ok) {
			const data = await res.json();
			setLiked(!liked);
			setCount(data.likes);
		}
	};

	return (
		<Button className="p-4 h-full" variant={"outline"} onClick={toggleLike}>
			{count}
			{liked ? (
				<HeartIcon className="size-6 text-red-600" />
			) : (
				<HeartIcon className="size-6 text-neutral-600" />
			)}
		</Button>
	);
}
