import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="space-y-6">
			<ul>
				<li>
					<Link href="stories">Hikayeler</Link>
				</li>
				<li>
					<Link href="write">Hikaye Yaz</Link>
				</li>
			</ul>
		</div>
	);
}
