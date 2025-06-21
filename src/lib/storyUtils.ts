import { Story } from "@/models/story.model";
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

export function transformFromScenes(scenes: Scene[]): {
	nodes: Node<SceneData>[];
	edges: Edge<SceneEdgeData>[];
} {
	const nodes: Node<SceneData>[] = scenes.map((scene) => ({
		id: scene.id,
		type: "custom",
		position: scene.position,
		data: {
			label: scene.label,
			description: scene.description,
		},
	}));

	const edges: Edge<SceneEdgeData>[] = scenes.flatMap((scene) =>
		scene.choices.map((choice) => ({
			id: `edge-${scene.id}-${choice.nextSceneId}`,
			source: scene.id,
			target: choice.nextSceneId,
			label: choice.optionText,
			type: "default",
			data: {
				optionText: choice.optionText,
			},
			style: {
				stroke: "#4ade80",
				strokeWidth: 2,
			},
		}))
	);

	return { nodes, edges };
}

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

export function transformToStory(rawStory: Story) {
	const scenes: Scene[] = rawStory.scenes.map((scene: Scene, index: number) => ({
		id: scene.id,
		label: scene.label ?? `Sahne ${index + 1}`,
		description: scene.description ?? "",
		position: scene.position ?? { x: 0, y: 0 },
		choices: (scene.choices ?? []).map((choice: Choice) => ({
			optionText: choice.optionText,
			nextSceneId: choice.nextSceneId,
		})),
	}));

	const story: Story = {
		_id: rawStory._id,
		title: rawStory.title,
		description: rawStory.description,
		startSceneId: rawStory.startSceneId,
		scenes,
		createdBy: rawStory.createdBy,
		createdAt: rawStory.createdAt,
		updatedAt: rawStory.updatedAt,
	};

	return story;
}

export async function saveStoryToDatabase(
	title: string,
	description: string,
	startSceneId: string,
	scenes: Scene[],
	storyId?: string
) {
	try {
		const method = storyId ? "PUT" : "POST";
		const url = storyId ? `/api/stories/${storyId}` : "/api/stories";

		const response = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title, description, startSceneId, scenes }),
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
