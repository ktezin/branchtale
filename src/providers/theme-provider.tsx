"use client";

import { createContext, useContext, useState } from "react";
import { twMerge } from "tailwind-merge";

type ThemeContextType = {
	darkMode: boolean;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [darkMode, setDarkMode] = useState(false);

	return (
		<ThemeContext.Provider
			value={{
				darkMode,
				toggleTheme: () => setDarkMode(!darkMode),
			}}
		>
			<body
				className={twMerge(
					darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
				)}
			>
				{children}
			</body>
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within ThemeProvider");
	return context;
}
