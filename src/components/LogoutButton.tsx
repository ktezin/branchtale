"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
	return (
		<button
			onClick={() => signOut({ callbackUrl: "/" })}
			className="p-2 rounded-lg hover:shadow"
		>
			Çıkış Yap
		</button>
	);
}
