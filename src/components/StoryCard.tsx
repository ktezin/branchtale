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
			className="rounded-2xl shadow dark:bg-neutral-900 hover:shadow-lg dark:hover:dark:bg-neutral-950 dark:hover:border dark:shadow-lg dark:hover:shadow-white/5 transition p-4 flex flex-col min-w-[200px] sm:min-w-[250px]"
		>
			{coverImage && (
				<img
					src={coverImage}
					alt={title}
					className="w-full h-40 object-cover rounded-xl mb-4"
				/>
			)}
			<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
				{title}
			</h3>
			{createdBy && <p className="text-sm text-gray-500">by {createdBy}</p>}
			{description && (
				<p className="mt-2 text-sm text-gray-600 line-clamp-3">{description}</p>
			)}
		</Link>
	);
}
