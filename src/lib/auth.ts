import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const {
	handlers: { GET, POST },
	auth,
} = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async session({ session, token }) {
			session.user.id = token.sub!;
			return session;
		},
	},
});
