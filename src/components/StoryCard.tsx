import Link from "next/link";

export default function StoryCard({
	id,
	title,
}: {
	id: string;
	title: string;
}) {
	return (
		<Link
			href={`/stories/${id}`}
			className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
		>
			<h3 className="text-xl font-semibold text-primary">{title}</h3>
			<p className="mt-2 text-gray-600">3 branching paths</p>
		</Link>
	);
}
