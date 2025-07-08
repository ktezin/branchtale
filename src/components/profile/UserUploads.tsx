"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from "@/models/upload.model";

export default function UserUploads() {
	const [uploads, setUploads] = useState<Upload[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchUploads = async () => {
		setLoading(true);
		const res = await fetch("/api/uploads");
		if (res.ok) {
			const data = await res.json();
			setUploads(data.uploads);
		} else {
			toast("Dosyalar yüklenirken hata oluştu");
		}
		setLoading(false);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;

		const res = await fetch(`/api/uploads/${id}`, {
			method: "DELETE",
		});

		if (res.ok) {
			setUploads((prev) => prev.filter((u) => u._id.toString() !== id));
			toast("Dosya silindi");
		} else {
			toast("Silme işlemi başarısız");
		}
	};

	useEffect(() => {
		fetchUploads();
	}, []);

	if (loading) return <p>Yükleniyor...</p>;

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{uploads.length === 0 && (
				<p className="text-gray-500 col-span-full">
					Henüz yüklenmiş dosya yok.
				</p>
			)}
			{uploads.map((upload) => (
				<div
					key={upload._id.toString()}
					className="relative border rounded p-2 flex flex-col items-center"
				>
					{upload.type === "image" ? (
						<img
							src={upload.url}
							alt="Yüklenen görsel"
							className="w-full h-32 object-cover rounded"
						/>
					) : (
						<video
							src={upload.url}
							controls
							className="w-full h-32 object-cover rounded"
						/>
					)}
					<p className="text-xs mt-2">{upload.size.toFixed(2)} MB</p>
					<Button
						variant="destructive"
						className="w-full mt-2"
						onClick={() => handleDelete(upload._id.toString())}
					>
						Sil
					</Button>
				</div>
			))}
		</div>
	);
}
