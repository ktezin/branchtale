import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStories from "@/components/profile/UserStories";
import User, { IUser } from "@/models/user.model";
import UserLikes from "@/components/profile/UserLikes";

export default async function ProfilePage() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/login");
	}

	const user: IUser | null = await User.findById(session.user.id);
	if (!user) {
		redirect("/login");
	}

	return (
		<div className="mx-[10vw] md:mx-[15vw] lg:mx-[20vw] p-4 flex flex-col gap-6">
			<ProfileHeader user={user} />

			<section>
				<h2 className="text-xl font-semibold mb-2">Oluşturduğun Hikayeler</h2>
				<UserStories username={user.username} />
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">Beğendiklerin</h2>
				<UserLikes userId={session.user.id} />
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">Kaydedilen Hikayeler</h2>
				{/*<UserBookmarks userId={session.user.id} />*/}
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">Yorumların</h2>
				{/*<UserComments userId={session.user.id} />*/}
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">Yüklenen Dosyaların</h2>
				{/*<UserUploads userId={session.user.id} />*/}
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">Profil Ayarları</h2>
				{/*<ProfileSettings userId={session.user.id} />*/}
			</section>
		</div>
	);
}
