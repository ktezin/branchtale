import { SceneData } from "@/types";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

export default function CustomNode({ data }: NodeProps<Node<SceneData>>) {
	return (
		<div className="rounded-lg bg-neutral-900 hover:bg-neutral-950 text-white border border-white p-2 shadow">
			<Handle
				type="target"
				position={Position.Top}
				onConnect={(params) => console.log("handle onConnect", params)}
			/>
			<strong>{data.label}</strong>
			<p className="text-sm text-gray-400">{data.description}</p>
			<Handle type="source" position={Position.Bottom} />
		</div>
	);
}
