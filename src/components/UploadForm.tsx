"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function UploadForm() {
	const [file, setFile] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	const handleUpload = async () => {
		if (!file) {
			toast.error("Lütfen bir dosya seçin.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		setIsLoading(true);
		setProgress(0);

		try {
			const res = await fetch("/api/uploads", {
				method: "POST",
				body: formData, 
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Yükleme başarısız.");
			}

			const data = await res.json();
			toast.success("Yükleme tamamlandı! " + data.message);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Yükleme sırasında bir hata oluştu.");
		} finally {
			setIsLoading(false);
			setProgress(0);
			setFile(null);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<Input
				type="file"
				accept="image/png,image/jpeg,image/webp,video/mp4"
				onChange={(e) => {
					const selected = e.target.files?.[0];
					if (selected) setFile(selected);
				}}
			/>

			{file && (
				<div className="text-sm text-gray-500">
					Seçilen: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
				</div>
			)}

			{isLoading && <Progress value={progress} className="h-1" />}

			<Button
				onClick={handleUpload}
				disabled={isLoading || !file}
				variant="default"
			>
				{isLoading ? "Yükleniyor..." : "Yükle"}
			</Button>
		</div>
	);
}
