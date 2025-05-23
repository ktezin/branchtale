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

const initialEdges: Edge<SceneEdgeData>[] = [];

export default function SceneEditor() {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node<SceneData>>([]);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	const [edges, setEdges, onEdgesChange] =
		useEdgesState<Edge<SceneEdgeData>>(initialEdges);
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
		const newNode: Node<SceneData> = {
			id: crypto.randomUUID(),
			type: "default",
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
		const storyTitle = prompt("Hikaye başlığı girin:");
		if (!storyTitle) return;

		const scenes = transformToScenes(nodes, edges);
		const startSceneId = nodes[0]?.id; // İstersen daha sonra kullanıcıdan seçmesini isteyebilirsin.

		try {
			const storyId = await saveStoryToDatabase(
				storyTitle,
				startSceneId,
				scenes
			);
			alert(`Hikaye başarıyla kaydedildi! ID: ${storyId}`);
		} catch (err) {
			alert("Kayıt sırasında bir hata oluştu." + err);
		}
	};

	return (
		<div style={{ width: "100%", height: "90vh" }}>
			<button
				onClick={addNode}
				className="absolute z-10 p-2 m-2 bg-blue-500 text-white rounded"
			>
				Yeni Sahne Ekle
			</button>
			<button
				onClick={handleSave}
				className="absolute z-10 p-2 m-2 top-28 bg-green-500 text-white rounded"
			>
				Hikayeyi Kaydet
			</button>

			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeClick={onNodeClick}
				onEdgeClick={onEdgeClick}
				fitView
			>
				<MiniMap />
				<Controls />
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
