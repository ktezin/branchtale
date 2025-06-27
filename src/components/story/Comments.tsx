"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/models/comment.model";
import CommentItem from "./CommentItem";
import { Skeleton } from "@/components/ui/skeleton";

export default function Comments({ storyId }: { storyId: string }) {
	const [isLoading, setIsLoading] = useState(true);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");

	const fetchComments = async () => {
		const res = await fetch(`/api/comments?storyId=${storyId}`);
		const data = await res.json();
		setComments(data.comments);
		setIsLoading(false);
	};

	const handleSubmit = async () => {
		const res = await fetch("/api/comments", {
			method: "POST",
			body: JSON.stringify({ storyId, content: newComment }),
			headers: { "Content-Type": "application/json" },
		});

		if (res.ok) {
			setNewComment("");
			fetchComments();
		}
	};

	useEffect(() => {
		fetchComments();
	}, []);

	return (
		<div className="space-y-4">
			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
				Yorumlar{" "}
				<span className="text-lg text-neutral-600">( {comments.length} )</span>
			</h3>
			<Textarea
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
				placeholder="Yorum yaz..."
			/>
			<Button onClick={handleSubmit}>Gönder</Button>

			{isLoading ? (
				<SkeletonComments />
			) : comments.length > 0 ? (
				comments.map((comment: Comment) => (
					<CommentItem key={comment._id.toString()} comment={comment} />
				))
			) : (
				<p>
					Henüz yorum yapılmamış. <br /> İlk yazan sen ol.
				</p>
			)}
		</div>
	);
}

function SkeletonComments() {
	return [0, 1, 2].map((i) => (
		<Skeleton key={i} className="h-28 w-full rounded-md" />
	));
}
