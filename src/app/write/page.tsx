import SceneEditor from "@/components/SceneEditor";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function WritePage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	return (
		<main className="p-4">
			<h1 className="text-2xl font-bold mb-4">Hikaye Oluştur</h1>
			<SceneEditor />
		</main>
	);
}
