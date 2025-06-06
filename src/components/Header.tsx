import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

type NavLink = {
	text: string;
	href: string;
};

export default async function Header() {
	const session = await getServerSession(authOptions);

	const links: NavLink[] = [
		{ text: "Ana Sayfa", href: "/" },
		{ text: "Blog", href: "/blog" },
		{ text: "Hikaye Yaz", href: "/write" },
	];

	return (
		<header
			className="
		px-[10vw] 
		flex 
		justify-center 
		md:justify-between 
		items-center 
		w-full
		p-4 
		md:px-[15vw] 
		lg:px-[20vw] 
		shadow 
		dark:shadow-lg 
		dark:shadow-white/5 
		dark:bg-black 
		dark:border"
		>
			<Link href="/" className="font-bold text-2xl text-center">
				BranchTale
			</Link>
			<div className="hidden md:flex items-center gap-1">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="p-2 rounded-lg hover:shadow dark:hover:border"
					>
						{link.text}
					</Link>
				))}

				{session ? (
					<>
						<Link href="/profile" className="p-2 rounded-lg hover:shadow">
							Hesabım
						</Link>
						<LogoutButton />
					</>
				) : (
					<Link href="/login" className="p-2 rounded-lg hover:shadow">
						Giriş Yap
					</Link>
				)}
			</div>
		</header>
	);
}
