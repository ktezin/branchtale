import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	const isProtected = protectedRoutes.some((path) =>
		req.nextUrl.pathname.startsWith(path)
	);

	if (isProtected && !token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*",], // middleware nerelerde çalışacak
};
