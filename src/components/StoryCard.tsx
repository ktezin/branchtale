import Link from "next/link";

export default function StoryCard({
	id,
	title,
	description,
	coverImage,
	createdBy,
}: {
	id: string;
	title: string;
	description?: string;
	coverImage?: string;
	createdBy: string;
}) {
	return (
		<Link
			href={`/stories/${id}`}
			className="rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col min-h-40"
		>
			{coverImage && (
				<img
					src={coverImage}
					alt={title}
					className="w-full h-40 object-cover rounded-xl mb-4"
				/>
			)}
			<h3 className="text-lg font-semibold text-gray-800">{title}</h3>
			{createdBy && <p className="text-sm text-gray-500">by {createdBy}</p>}
			{description && (
				<p className="mt-2 text-sm text-gray-600 line-clamp-3">{description}</p>
			)}
		</Link>
	);
}
