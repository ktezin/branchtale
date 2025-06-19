import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LikeButton from "@/components/story/LikeButton";
import { Story } from "@/models/story.model";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
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
			<h1 className="text-4xl font-bold mb-8">{story.title}</h1>
			<h3 className="text-xl mb-8">{story.description}</h3>

			<Link
				href={id + "/read"}
				className="p-4 px-8 bg-emerald-500 hover:bg-emerald-600  rounded-lg"
			>
				Oku
			</Link>

			<div className="h-12">
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
			</div>
		</main>
	);
}
