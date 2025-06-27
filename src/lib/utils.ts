import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: string | Date): string {
	const now = new Date();
	const past = typeof date === "string" ? new Date(date) : date;
	const diff = (now.getTime() - past.getTime()) / 1000;

	if (diff < 60) return "birkaç saniye önce";
	if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
	if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
	if (diff < 2592000) return `${Math.floor(diff / 604800)} hafta önce`;
	if (diff < 31536000) return `${Math.floor(diff / 2592000)} ay önce`;

	return `${Math.floor(diff / 31536000)} yıl önce`;
}
