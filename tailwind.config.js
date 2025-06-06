/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: "#2ecc71", // BranchTale yeşili
				secondary: "#3498db", // Aksan mavisi
			},
		},
	},
	plugins: [require("@tailwindcss/line-clamp")],
};
