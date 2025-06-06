import { Story } from "@/models/story.model";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StoryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
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
			<Link href={id + "/read"} className="w-full bg-emerald-500 hover:bg-emerald-600 p-4 rounded-lg">Oku</Link>
		</main>
	);
}
