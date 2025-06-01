import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { hash } from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();
		const { email, password, username } = await req.json();

		if (!email || !password || !username) {
			return NextResponse.json({ error: "Eksik alanlar var" }, { status: 400 });
		}

		const existingUser = await UserModel.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ error: "Bu e-posta ile zaten bir kullanıcı var" },
				{ status: 409 }
			);
		}

		const hashedPassword = await hash(password, 10);

		const newUser = await UserModel.create({
			email,
			username,
			password: hashedPassword,
			provider: "credentials",
		});

		return NextResponse.json(
			{ message: "Kayıt başarılı", userId: newUser._id },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Kayıt hatası:", error);
		return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
	}
}
