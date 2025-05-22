"use client";

import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";

interface OptionModalProps {
	isOpen: boolean;
	onClose: () => void;
	optionText: string;
	onSave: (newText: string) => void;
}

export default function OptionModal({
	isOpen,
	onClose,
	optionText,
	onSave,
}: OptionModalProps) {
	const [text, setText] = useState(optionText);

	const handleSave = () => {
		onSave(text);
		onClose();
	};

	return (
		<Transition show={isOpen} as={Fragment}>
			<Dialog
				onClose={onClose}
				className="fixed inset-0 z-50 flex items-center justify-center"
			>
				<div className="fixed inset-0 bg-black/50" aria-hidden="true" />
				<DialogPanel className="bg-white rounded-xl p-6 w-full max-w-md z-50">
					<DialogTitle className="text-lg font-bold mb-4">
						Seçenek Düzenle
					</DialogTitle>
					<textarea
						className="w-full border p-2 rounded mb-4"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<div className="flex justify-end gap-2">
						<button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
							İptal
						</button>
						<button
							className="bg-blue-500 text-white px-4 py-2 rounded"
							onClick={handleSave}
						>
							Kaydet
						</button>
					</div>
				</DialogPanel>
			</Dialog>
		</Transition>
	);
}
