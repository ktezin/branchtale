"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (res?.error) {
			setError("Giriş başarısız: " + res.error);
		} else {
			router.push("/");
            router.refresh();
		}
	};

	return (
		<div className="max-w-md mx-auto mt-20 p-6 shadow dark:bg-neutral-900 rounded-lg">
			<h1 className="text-2xl font-bold mb-4">Giriş Yap</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full px-4 py-2 border rounded"
					required
				/>
				<input
					type="password"
					placeholder="Şifre"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full px-4 py-2 border rounded"
					required
				/>
				{error && <p className="text-red-500 text-sm">{error}</p>}
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					Giriş Yap
				</button>
			</form>
			<hr className="my-4" />
			<button
				onClick={() => signIn("google")}
				className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
			>
				Google ile Giriş Yap
			</button>
		</div>
	);
}
