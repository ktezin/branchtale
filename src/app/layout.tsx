import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="tr">
			<body className={`${inter.className} bg-gray-50`}>
				{children}
			</body>
		</html>
	);
}
