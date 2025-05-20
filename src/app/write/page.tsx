"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

type Choice = {
	text: string;
	nextSceneId: string;
};

type Scene = {
	id: string;
	text: string;
	choices: Choice[];
};

export default function StoryCreator() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [scenes, setScenes] = useState<Scene[]>([
		{ id: "scene1", text: "", choices: [] },
	]);
	const [newScene, setNewScene] = useState("");

	const addScene = () => {
		setScenes([...scenes, { id: newScene, text: "", choices: [] }]);
		setNewScene("");
	};

	const removeScene = (removingScene: Scene) => {
		setScenes(scenes.filter((scene) => scene.id !== removingScene.id));
	};

	const addChoice = (sceneId: string) => {
		setScenes(
			scenes.map((scene) =>
				scene.id === sceneId
					? {
							...scene,
							choices: [...scene.choices, { text: "", nextSceneId: "" }],
					  }
					: scene
			)
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/stories`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						title,
						scenes,
						startSceneId: scenes[0]?.id,
					}),
				}
			);

			if (response.ok) {
				const { id } = await response.json();
				router.push(`/stories/${id}`);
			}
		} catch (error) {
			console.error("Gönderim hatası:", error);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8">Yeni Hikaye Oluştur</h1>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Başlık Alanı */}
				<div>
					<label htmlFor="title" className="block text-lg mb-2">
						Hikaye Başlığı
					</label>
					<input
						id="title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				{/* Sahne Listesi */}
				{scenes.map((scene, index) => (
					<div key={scene.id} className="border p-4 rounded-lg shadow-sm">
						<div className="flex justify-between">
							<h2 className="text-xl font-semibold mb-3">
								Sahne {index + 1}{" "}
								<input
									type="text"
									className="text-sm text-gray-500"
									defaultValue={`(${scene.id})`}
								/>
							</h2>

							<button onClick={() => removeScene(scene)}>
								<TrashIcon className="h-6 w-6 text-red-500" />
							</button>
						</div>

						<textarea
							value={scene.text}
							onChange={(e) =>
								setScenes(
									scenes.map((s) =>
										s.id === scene.id ? { ...s, text: e.target.value } : s
									)
								)
							}
							className="w-full p-3 border rounded mb-3 h-32 focus:ring-2 focus:ring-blue-500"
							placeholder="Sahne metnini yazın..."
							required
						/>

						{/* Seçenekler */}
						<div className="space-y-3">
							{scene.choices.map((choice, choiceIndex) => (
								<div key={choiceIndex} className="flex gap-3 items-center">
									<input
										type="text"
										value={choice.text}
										onChange={(e) =>
											setScenes(
												scenes.map((s) =>
													s.id === scene.id
														? {
																...s,
																choices: s.choices.map((c, i) =>
																	i === choiceIndex
																		? { ...c, text: e.target.value }
																		: c
																),
														  }
														: s
												)
											)
										}
										className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
										placeholder="Seçenek metni"
										required
									/>
									<span className="text-gray-500">→</span>
									<select
										value={choice.nextSceneId}
										onChange={(e) =>
											setScenes(
												scenes.map((s) =>
													s.id === scene.id
														? {
																...s,
																choices: s.choices.map((c, i) =>
																	i === choiceIndex
																		? { ...c, nextSceneId: e.target.value }
																		: c
																),
														  }
														: s
												)
											)
										}
										className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
										required
									>
										<option value="">Hedef sahne seç</option>
										{scenes.map((s) => (
											<option key={s.id} value={s.id}>
												{s.id === scene.id ? `${s.id} (Mevcut)` : s.id}
											</option>
										))}
									</select>
								</div>
							))}

							<button
								type="button"
								onClick={() => addChoice(scene.id)}
								className="text-blue-500 mt-2 flex items-center gap-1 text-sm"
							>
								<span>+</span> Seçenek Ekle
							</button>
						</div>
					</div>
				))}

				<div className="flex gap-4 pt-4">
					{!newScene ? (
						<div className="flex gap-4 pt-4">
							<button
								type="button"
								onClick={() => setNewScene(`scene_${scenes.length + 1}`)}
								className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition-colors flex items-center gap-1"
							>
								<span>+</span> Yeni Sahne Ekle
							</button>
							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
							>
								Hikayeyi Kaydet
							</button>
						</div>
					) : (
						<div className="flex gap-4 pt-4">
							<input
								type="text"
								placeholder="Sahne ID'sini gir"
								className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
								required
								onChange={(e) =>
									e.target.value.length > 0 && setNewScene(e.target.value)
								}
							/>
							<button
								type="button"
								onClick={() => setNewScene("")}
								className="bg-red-200 hover:bg-red-300 px-4 py-2 rounded transition-colors flex items-center gap-1"
							>
								İptal Et
							</button>
							<button
								type="button"
								className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
								onClick={addScene}
							>
								Sahne Oluştur
							</button>
						</div>
					)}
				</div>
			</form>
		</div>
	);
}
