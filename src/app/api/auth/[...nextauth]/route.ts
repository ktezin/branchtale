// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { Account, SessionStrategy, TokenSet, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import UserModel from "@/models/user.model";
import { compare } from "bcryptjs";
import { clientPromise } from "@/lib/mongodbClient";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions = {
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials || !credentials.email || !credentials.password) {
					throw new Error("Geçersiz giriş bilgileri");
				}

				const user = await UserModel.findOne({ email: credentials.email });
				if (!user || !user.password) throw new Error("Kullanıcı bulunamadı");

				const isValid = await compare(credentials.password, user.password);
				if (!isValid) throw new Error("Geçersiz şifre");

				return user;
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async signIn({ user, account }: { user: User; account: Account | null }) {
			if (account?.provider === "google") {
				const existingUser = await UserModel.findOne({ email: user.email });
				if (!existingUser) {
					await UserModel.create({
						email: user.email,
						username: user.email?.split("@")[0],
						provider: "google",
					});
				}
			}
			return true;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user) {
				(session.user as any).id = token.sub;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt" as SessionStrategy, // Tip güvenliği için cast işlemi
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
