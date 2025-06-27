"use client";

import { Comment, CommentUser } from "@/models/comment.model";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatTimeAgo } from "@/lib/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import {
	ChevronDownIcon,
	ChevronUpDownIcon,
	ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { ChevronDown, ReplyIcon } from "lucide-react";

export default function CommentItem({
	comment,
	depth = 0,
	maxDepth = 2,
}: {
	comment: Comment;
	depth?: number;
	maxDepth?: number;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [newReply, setNewReply] = useState("");
	const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
	const isOnMaxDepth = depth >= maxDepth;

	const handleSubmit = async () => {
		if (!newReply.trim()) {
			alert("Yanıt boş olamaz");
			return;
		}
		setIsLoading(true);
		try {
			const res = await fetch("/api/comments", {
				method: "POST",
				body: JSON.stringify({
					storyId: comment.storyId,
					content: newReply,
					parentComment: comment._id,
				}),
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				throw new Error("Yanıt gönderilemedi");
			}

			const createdReply = await res.json();
			setNewReply("");
			setReplies((prev) => [...prev, createdReply]);
			setIsOpen(true);
		} catch (error) {
			alert("Yanıtınız gönderilirken bir sorun oluştu");
		} finally {
			setIsLoading(false);
			setIsReplying(false);
		}
	};

	const shiftBy = isOnMaxDepth ? 0 : Math.min(depth * 2, maxDepth);

	return (
		<div
			className={`ml-${shiftBy} flex flex-col gap-3 w-full`}
			style={{
				marginLeft: `${shiftBy * 8}px`,
				width: `calc(100% - ${shiftBy * 8}px)`,
			}}
		>
			<div className="relative overflow-hidden flex flex-col gap-4 border-l rounded-lg">
				<div className="flex justify-between items-center gap-2 px-3 p-2">
					<p className="text-sm text-muted-foreground">
						@{(comment.userId as CommentUser).username}
					</p>
				</div>

				<div className="px-3">
					<p className="whitespace-pre-line">{comment.content}</p>
				</div>

				<div className="flex justify-between items-center px-3">
					<p className="text-xs text-muted-foreground">
						{formatTimeAgo(comment.createdAt)}
					</p>
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground h-8 px-2"
						onClick={() => setIsReplying(!isReplying)}
					>
						<ReplyIcon className="h-4 w-4 mr-1" />
						Yanıtla
					</Button>
				</div>

				{isReplying && (
					<div className="p-3 border-t">
						<Textarea
							value={newReply}
							onChange={(e) => setNewReply(e.target.value)}
							placeholder="Yanıt yaz..."
							className="mb-2"
							disabled={isLoading}
						/>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => setIsReplying(false)}
								disabled={isLoading}
							>
								İptal
							</Button>
							<Button onClick={handleSubmit} disabled={isLoading}>
								{isLoading ? "Gönderiliyor..." : "Gönder"}
							</Button>
						</div>
					</div>
				)}
			</div>
			{replies.length > 0 && (
				<div className="flex flex-col gap-2">
					{replies.map((reply: Comment) => (
						<CommentItem
							key={reply._id.toString()}
							comment={reply}
							depth={isOnMaxDepth ? depth : depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}
