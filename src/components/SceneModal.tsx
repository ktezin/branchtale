"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

type SceneModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string;
	onSave: (title: string, description: string) => void;
};

export default function SceneModal({
	isOpen,
	onClose,
	title,
	description,
	onSave,
}: SceneModalProps) {
	const [tempTitle, setTempTitle] = useState(title);
	const [tempDesc, setTempDesc] = useState(description);

	useEffect(() => {
		setTempTitle(title);
		setTempDesc(description);
	}, [title, description]);

	const handleSave = () => {
		onSave(tempTitle, tempDesc);
		onClose();
	};

	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-50">
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md w-full max-w-md">
					<DialogTitle className="text-lg font-semibold mb-4">
						Sahneyi Düzenle
					</DialogTitle>

					<input
						type="text"
						value={tempTitle}
						onChange={(e) => setTempTitle(e.target.value)}
						placeholder="Sahne Başlığı"
						className="w-full p-2 border rounded mb-3"
					/>

					<textarea
						value={tempDesc}
						onChange={(e) => setTempDesc(e.target.value)}
						placeholder="Sahne Açıklaması"
						className="w-full p-2 border rounded h-32 mb-4"
					/>

					<div className="flex justify-end gap-2">
						<button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-neutral-800">
							İptal
						</button>
						<button
							onClick={handleSave}
							className="px-4 py-2 rounded bg-blue-500 text-white"
						>
							Kaydet
						</button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
