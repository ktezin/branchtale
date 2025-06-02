"use client";

import { Node, Edge } from "@xyflow/react";
import SceneEditor from "@/components/SceneEditor";

type Props = {
	title: string;
	initialNodes: Node[];
	initialEdges: Edge[];
};

export default function WriteClient({
	title,
	initialNodes,
	initialEdges,
}: Props) {
	return (
		<main className="p-4">
			<h1 className="text-2xl font-bold mb-4">{title}</h1>
			<SceneEditor initialNodes={initialNodes} initialEdges={initialEdges} />
		</main>
	);
}
