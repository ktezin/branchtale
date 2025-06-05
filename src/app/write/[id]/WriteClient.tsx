"use client";

import SceneEditor, { SceneEditorProps } from "@/components/SceneEditor";

export default function WriteClient({
	storyId,
	storyTitle,
	storyDescription,
	initialNodes,
	initialEdges,
}: SceneEditorProps) {
	return (
		<main className="p-4">
			<h1 className="text-2xl font-bold mb-4">{storyTitle}</h1>
			<SceneEditor
				storyId={storyId}
				storyTitle={storyTitle}
				storyDescription={storyDescription}
				initialNodes={initialNodes}
				initialEdges={initialEdges}
			/>
		</main>
	);
}
