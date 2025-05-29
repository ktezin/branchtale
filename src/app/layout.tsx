import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="tr">
			<body className={`${inter.className} bg-gray-50`}>
				<Header />
				{children}
			</body>
		</html>
	);
}
