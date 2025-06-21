"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Comment } from "@/models/comment.model";
import { Card, CardContent } from "../ui/card";

export default function Comments({ storyId }: { storyId: string }) {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");

	const fetchComments = async () => {
		const res = await fetch(`/api/comments?storyId=${storyId}`);
		const data = await res.json();
		setComments(data.comments);
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

			{comments.length > 0 ? (
				comments.map((comment: Comment) => (
					<Card key={comment._id.toString()} className="border p-3 rounded">
						<CardContent>
							<p className="text-sm text-gray-600">
								@{comment.userId.toString()}
							</p>
							<p>{comment.content}</p>
						</CardContent>
					</Card>
				))
			) : (
				<p>Henüz yorum yapılmamış. <br /> İlk yazan sen ol.</p>
			)}
		</div>
	);
}
