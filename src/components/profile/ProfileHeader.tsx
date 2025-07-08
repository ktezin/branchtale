import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ProfileHeader({ user }: { user: { username: string; email: string; image?: string } }) {
	return (
		<div className="flex flex-col md:flex-row md:justify-between items-center gap-4 p-4 border rounded-lg">
			<div className="flex items-center">
				<Image
					src={user.image || "/default-avatar.png"}
					alt="Profil Resmi"
					width={160}
					height={160}
					className="rounded-full object-cover"
				/>
				<div>
					<p className="font-semibold text-lg">{user.username}</p>
					<p className="text-gray-500 text-sm">{user.email}</p>
				</div>
			</div>
			<div className="flex md:flex-col gap-1">
				<Button variant="outline">Profili Düzenle</Button>
				<Button variant="outline">Çıkış Yap</Button>
			</div>
		</div>
	);
}
