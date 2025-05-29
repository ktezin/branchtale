"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SceneEditor from "@/components/SceneEditor";
import { transformFromScenes } from "@/lib/storyUtils";
import { Node, Edge } from "@xyflow/react";
import { Story } from "@/models/story.model";

export default function WritePage() {
	const { id } = useParams();
	const [story, setStory] = useState<Story>();
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStory = async () => {
			try {
				const res = await fetch(`/api/stories/${id}`);
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Hikaye yüklenemedi");

				setStory(data);

				const { nodes, edges } = transformFromScenes(data.scenes);
				setNodes(nodes);
				setEdges(edges);
				setLoading(false);
			} catch (error) {
				console.error("Yükleme hatası:", error);
			}
		};

		if (id) fetchStory();
	}, [id]);

	if (loading) return <div>Yükleniyor...</div>;

	return (
		<main className="p-4">
			<h1 className="text-2xl font-bold mb-4">{story ? story.title : "Hikaye Başlığı"}</h1>
			<SceneEditor initialNodes={nodes} initialEdges={edges} />
		</main>
	);
}
