"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

function NotFoundPage() {
	const router = useRouter();

	return (
		<div className="w-full h-[80vh] flex flex-col items-center justify-center  text-center">
			<h1 className="font-bold text-7xl text-shadow-lg/30 my-4">404</h1>
			<h2 className="font-bold text-2xl text-gray-800">Sayfa bulunamadı</h2>
			<p className=" text-gray-800">
				Aramaya çalıştığınız sayfa mevcut değil ya da henüz geliştirilmemiş olabilir.
			</p>
			<div className="flex my-4">
				<Link href="/">
					<button className="p-3 m-2 bg-emerald-400 rounded-lg text-white text-shadow-lg shadow">
						Ana Sayfaya Dön
					</button>
				</Link>
				<button
					className="p-3 m-2 bg-rose-400 rounded-lg text-white text-shadow-lg shadow"
					onClick={router.back}
				>
					Geri Dön
				</button>
			</div>
		</div>
	);
}

export default NotFoundPage;
