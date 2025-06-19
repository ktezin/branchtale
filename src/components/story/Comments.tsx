"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function Comments({ storyId }: { storyId: string }) {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");

	const fetchComments = async () => {
		const res = await fetch(`/api/comments?storyId=${storyId}`);
		const data = await res.json();
		setComments(data);
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
		<div className="mt-4 mb-12 space-y-4">
			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
				Yorumlar
			</h3>
			<Textarea
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
				placeholder="Yorum yaz..."
			/>
			<Button onClick={handleSubmit}>Gönder</Button>

			{comments &&
				comments.length > 0 &&
				comments.map((comment: any) => (
					<div key={comment._id} className="border p-3 rounded">
						<p className="text-sm text-gray-600">{comment.userId.username}</p>
						<p>{comment.content}</p>
					</div>
				))}
		</div>
	);
}
