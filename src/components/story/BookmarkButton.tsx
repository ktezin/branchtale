"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Story } from "@/models/story.model";

export default function BookmarkButton({ storyId }: { storyId: string }) {
	const [isBookmarked, setIsBookmarked] = useState(false);

	useEffect(() => {
		const fetchBookmarks = async () => {
			const res = await fetch("/api/users/bookmarks");
			const data = await res.json();

			if (data.bookmarks?.some((story: Story) => story._id === storyId)) {
				setIsBookmarked(true);
			}
		};

		fetchBookmarks();
	}, [storyId]);

	const toggleBookmark = async () => {
		const res = await fetch(`/api/stories/${storyId}/bookmark`, {
			method: "POST",
		});

		if (res.ok) {
			setIsBookmarked((prev) => !prev);
		}
	};

	return (
		<Button className="p-4 h-full" variant={"outline"} onClick={toggleBookmark}>
			{isBookmarked ? (
				<BookmarkIcon className="size-6 text-emerald-600" />
			) : (
				<BookmarkIcon className="size-6 text-neutral-600" />
			)}
		</Button>
	);
}
