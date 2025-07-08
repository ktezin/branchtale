import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="tr">
			<body
				className={`${inter.className} bg-white dark:bg-neutral-950 dark:text-white`}
			>
				<Header />
				{children}
				<Toaster />
				<Navbar />
			</body>
		</html>
	);
}
