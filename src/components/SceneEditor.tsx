"use client";

import React, { useCallback, useState } from "react";
import SceneModal from "./SceneModal";
import {
	ReactFlow,
	MiniMap,
	Controls,
	Background,
	addEdge,
	useNodesState,
	useEdgesState,
	Connection,
	Edge,
	Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { SceneData, SceneEdgeData } from "@/types";
import OptionModal from "./OptionModal";
import { saveStoryToDatabase, transformToScenes } from "@/lib/storyUtils";
import { useParams, useRouter } from "next/navigation";
import CustomNode from "./CustomNode";

export type SceneEditorProps = {
	initialNodes?: Node[];
	initialEdges?: Edge[];
	storyId?: string;
	storyTitle?: string;
	storyDescription?: string;
};

export default function SceneEditor({
	initialNodes = [],
	initialEdges = [],
	storyId,
	storyTitle,
	storyDescription,
}: SceneEditorProps) {
	const router = useRouter();
	const params = useParams();

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const [selectedEdge, setSelectedEdge] = useState<Edge<SceneEdgeData> | null>(
		null
	);
	const [edgeModalOpen, setEdgeModalOpen] = useState(false);

	const onConnect = useCallback(
		(connection: Connection) => {
			const newEdge: Edge<SceneEdgeData> = {
				...connection,
				id: crypto.randomUUID(),
				label: "Yeni Seçenek",
				type: "default",
				data: {
					optionText: "Yeni Seçenek",
				},
				className:
					"rounded-md bg-neutral-900 hover:bg-neutral-950 text-white border border-white p-2 shadow",
			};

			setEdges((eds) => addEdge(newEdge, eds));
		},
		[setEdges]
	);

	const onEdgeClick = (_: any, edge: Edge<SceneEdgeData>) => {
		setSelectedEdge(edge);
		setEdgeModalOpen(true);
	};

	const onNodeClick = (_: any, node: Node) => {
		setSelectedNode(node);
		setModalOpen(true);
	};

	const addNode = () => {
		const newNode: SceneData = {
			id: crypto.randomUUID(),
			type: "custom",
			position: {
				x: Math.random() * 600,
				y: Math.random() * 400,
			},
			data: {
				label: "Yeni Sahne",
				description: "Sahne açıklaması buraya gelecek.",
			},
		};

		setNodes((nds) => [...nds, newNode]);
	};

	const handleSave = async () => {
		const promptTitle = prompt("Hikaye başlığı girin:", storyTitle);
		if (!promptTitle) return;

		const promptDescription = prompt(
			"Hikaye açıklaması girin:",
			storyDescription
		);
		if (!promptDescription) return;

		const scenes = transformToScenes(nodes, edges);
		const startSceneId = nodes[0]?.id;

		try {
			const savedId = await saveStoryToDatabase(
				promptTitle,
				promptDescription,
				startSceneId,
				scenes,
				storyId
			);

			alert(`Hikaye başarıyla kaydedildi! ID: ${savedId}`);

			if (!storyId) {
				router.push("/stories/" + savedId);
			}
			router.refresh();
		} catch (err) {
			alert("Kayıt sırasında bir hata oluştu." + err);
		}
	};

	return (
		<div style={{ width: "100%", height: "90vh" }}>
			<div className="absolute z-10 flex flex-col">
				<button
					onClick={addNode}
					className="p-2 m-2 bg-blue-500 text-white rounded"
				>
					Yeni Sahne Ekle
				</button>
				<button
					onClick={handleSave}
					className="p-2 m-2 bg-green-500 text-white rounded"
				>
					Hikayeyi Kaydet
				</button>
			</div>

			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeClick={onNodeClick}
				onEdgeClick={onEdgeClick}
				nodeTypes={{ custom: CustomNode }}
				fitView
			>
				<MiniMap />
				<Controls className="bg-red" />
				<Background />
			</ReactFlow>
			{selectedNode && (
				<SceneModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					title={(selectedNode.data as SceneData)?.label || ""}
					description={(selectedNode.data as SceneData)?.description || ""}
					onSave={(title, description) => {
						setNodes((nds) =>
							nds.map((node) =>
								node.id === selectedNode.id
									? {
											...node,
											data: { ...node.data, description, label: title },
									  }
									: node
							)
						);
					}}
				/>
			)}
			{selectedEdge && (
				<OptionModal
					isOpen={edgeModalOpen}
					onClose={() => setEdgeModalOpen(false)}
					optionText={selectedEdge.data?.optionText || ""}
					onSave={(newText) => {
						setEdges((eds) =>
							eds.map((e) =>
								e.id === selectedEdge.id
									? {
											...e,
											label: newText,
											data: { ...e.data, optionText: newText },
									  }
									: e
							)
						);
					}}
				/>
			)}
		</div>
	);
}
