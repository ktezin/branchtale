"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	BuildingLibraryIcon,
	HomeIcon,
	PencilIcon,
	UserIcon,
} from "@heroicons/react/24/outline";

const tabs = [
	{ label: "Ana Sayfa", href: "/", icon: HomeIcon },
	{ label: "Kitaplık", href: "/library", icon: BuildingLibraryIcon },
	{ label: "Yaz", href: "/write", icon: PencilIcon },
	{ label: "Profil", href: "/profile", icon: UserIcon },
];

export default function Navbar() {
	const pathname = usePathname();

	return (
		<nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-neutral-900 shadow z-50 flex justify-around">
			{tabs.map(({ label, href, icon: Icon }) => (
				<Link key={href} href={href} className="flex flex-col items-center p-2">
					<Icon
						className={`w-6 h-6 ${
							pathname === href ? "text-primary" : "text-muted-foreground"
						}`}
					/>
					<span className="text-xs">{label}</span>
				</Link>
			))}
		</nav>
	);
}
