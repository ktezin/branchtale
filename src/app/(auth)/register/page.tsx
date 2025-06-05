"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [form, setForm] = useState({ email: "", username: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});

		if (res.ok) {
			router.push("/login");
		} else {
			const data = await res.json();
			setError(data.message || "Bir hata oluştu");
		}

		setLoading(false);
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">Kayıt Ol</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					name="username"
					placeholder="Kullanıcı adı"
					value={form.username}
					onChange={handleChange}
					className="w-full p-2 border rounded bg-white text-black"
					required
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					className="w-full p-2 border rounded bg-white text-black"
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Şifre"
					value={form.password}
					onChange={handleChange}
					className="w-full p-2 border rounded bg-white text-black"
					required
				/>
				{error && <p className="text-red-500 text-sm">{error}</p>}
				<button
					type="submit"
					className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
					disabled={loading}
				>
					{loading ? "Kaydediliyor..." : "Kayıt Ol"}
				</button>
			</form>
		</div>
	);
}
