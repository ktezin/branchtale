"use client";

import { useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import type { Scene } from "@/models/story.model";

type SceneViewerProps = {
	scenes: Scene[];
	initialSceneId: string;
};

export default function SceneViewer({
	scenes,
	initialSceneId,
}: SceneViewerProps) {
	const [currentSceneId, setCurrentSceneId] = useState(initialSceneId);
	const [history, setHistory] = useState<string[]>([]);

	const currentScene = scenes.find((scene) => scene.id === currentSceneId);

	const handleChoice = (nextSceneId: string) => {
		setHistory((prev) => [...prev, currentSceneId]);
		setCurrentSceneId(nextSceneId);
	};

	const goBack = () => {
		if (history.length > 0) {
			const previousSceneId = history[history.length - 1];
			setHistory((prev) => prev.slice(0, -1));
			setCurrentSceneId(previousSceneId);
		}
	};

	if (!currentScene) {
		return (
			<div className="p-4 bg-red-100 text-red-800 rounded-lg">
				Sahne bulunamadı! Hikaye bozuk olabilir.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="p-6 bg-white rounded-lg shadow">
				<p className="whitespace-pre-line">{currentScene.description}</p>
			</div>

			{currentScene.choices.length > 0 ? (
				<div className="space-y-3">
					<h3 className="font-medium">Seçiminiz:</h3>
					{currentScene.choices.map((choice, index) => (
						<button
							key={index}
							onClick={() => handleChoice(choice.nextSceneId)}
							className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
						>
							{choice.optionText}
						</button>
					))}
				</div>
			) : (
				<div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
					Hikayenin sonuna geldiniz!
				</div>
			)}

			{history.length > 0 && (
				<button
					onClick={goBack}
					className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
				>
					<ArrowPathIcon className="h-4 w-4" />
					Önceki sahneye dön
				</button>
			)}
		</div>
	);
}
