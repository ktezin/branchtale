import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import Image from "next/image";

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
			className="h-full"
		>
			<Card className="pt-0 h-full">
				<CardContent className="p-0 w-[200px] h-[240px]">
					<img
						src={coverImage}
						alt={title}
						width={200}
						height={240}
						className="w-full h-full object-cover rounded-t-2xl"
					/>
				</CardContent>
				<CardFooter>
					<CardTitle>
						{title}
						{createdBy && (
							<p className="text-sm text-gray-500">by {createdBy}</p>
						)}
					</CardTitle>
				</CardFooter>
			</Card>
		</Link>
	);
}
