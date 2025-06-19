import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BookmarkButton from "@/components/story/BookmarkButton";
import Comments from "@/components/story/Comments";
import LikeButton from "@/components/story/LikeButton";
import { Story } from "@/models/story.model";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StoryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const session = await getServerSession(authOptions);
	const { id } = await params;
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${id}`
	);

	if (!res.ok) return notFound();

	const story: Story = await res.json();

	return (
		<main className="max-w-3xl mx-auto p-4">
			<div className="relative w-full h-64 rounded-lg overflow-hidden mb-6 shadow">
				<img
					src={"https://placehold.co/600x400"}
					alt="Hikaye Kapak"
					className="object-cover"
				/>
			</div>

			<h2 className="my-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				{story.title}
			</h2>
			<p className="my-4 leading-7 [&:not(:first-child)]:mt-6">
				{story.description}
			</p>

			<Link
				href={id + "/read"}
				className="p-4 px-8 bg-emerald-500 hover:bg-emerald-600  rounded-lg"
			>
				Oku
			</Link>

			<div className="my-12 h-12 flex">
				<LikeButton
					storyId={story._id}
					initialCount={story.likes.length}
					initialLiked={
						session
							? story.likes.some(
									(id: Types.ObjectId) => id.toString() === session.user.id
							  )
							: false
					}
				/>
				<BookmarkButton storyId={story._id} />
			</div>
			<Comments storyId={story._id} />
		</main>
	);
}
