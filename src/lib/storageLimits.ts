export const STORAGE_LIMITS = {
	free: {
		maxImages: 25,
		maxImageSize: 2 * 1024 * 1024,
		maxVideos: 5,
		maxVideoSize: 50 * 1024 * 1024,
		totalImageStorage: 100 * 1024 * 1024,
		totalVideoStorage: 250 * 1024 * 1024,
	},
	premium: {
		maxImages: 200,
		maxImageSize: 4 * 1024 * 1024,
		maxVideos: 20,
		maxVideoSize: 50 * 1024 * 1024,
		totalImageStorage: 5 * 1024 * 1024 * 1024,
		totalVideoStorage: 1024 * 1024 * 1024,
	},
	pro: {
		maxImages: 500,
		maxImageSize: 4 * 1024 * 1024,
		maxVideos: 40,
		maxVideoSize: 50 * 1024 * 1024,
		totalImageStorage: 50 * 1024 * 1024 * 1024,
		totalVideoStorage: 1024 * 1024 * 1024,
	},
} as const;

export type MembershipType = keyof typeof STORAGE_LIMITS;
