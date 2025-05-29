import Link from "next/link";

type NavLink = {
	text: string;
	href: string;
};

export default function Header() {
	const links: NavLink[] = [
		{ text: "Ana Sayfa", href: "/" },
		{ text: "Blog", href: "/blog" },
		{ text: "Hesabım", href: "/profile" },
	];

	return (
		<header className="flex justify-between items-center w-full p-2 px-[20vw] shadow">
			<Link href="/" className="font-bold">BranchTale</Link>
			<div className="flex items-center gap-1">
				{links.map((link) => (
					<Link href={link.href} className="p-2 rounded-lg hover:shadow">
						{link.text}
					</Link>
				))}
			</div>
		</header>
	);
}
