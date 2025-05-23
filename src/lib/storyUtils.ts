// src/lib/storyUtils.ts

import { SceneData, SceneEdgeData } from "@/types";
import { Node, Edge } from "@xyflow/react";

export type Choice = {
	optionText: string;
	nextSceneId: string;
};

export type Scene = {
	id: string;
	label: string;
	description: string;
	position: {
		x: number;
		y: number;
	};
	choices: Choice[];
};

export function transformToScenes(nodes: Node[], edges: Edge[]): Scene[] {
	return nodes.map((node) => {
		const nodeChoices: Choice[] = edges
			.filter((edge) => edge.source === node.id)
			.map((edge) => ({
				optionText: (edge.data as SceneEdgeData).optionText || "Seçenek",
				nextSceneId: edge.target,
			}));

		return {
			id: node.id,
			label: (node.data as SceneData).label || "Başlıksız",
			description: (node.data as SceneData).description || "",
			position: {
				x: node.position.x,
				y: node.position.y,
			},
			choices: nodeChoices,
		};
	});
}

export async function saveStoryToDatabase(
	title: string,
	startSceneId: string,
	scenes: Scene[]
) {
	try {
		const response = await fetch("/api/stories", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title, startSceneId, scenes }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Kayıt başarısız.");
		}

		const result = await response.json();
		return result.id;
	} catch (error) {
		console.error("Hikaye kaydederken hata:", error);
		throw error;
	}
}
