import mongoose, { Connection } from "mongoose";

let cachedConnection: Connection | null = null;

export async function connectToDatabase() {
	if (cachedConnection) {
		console.log("Using cached db connection");
		return cachedConnection;
	}
	try {
		const connection = await mongoose.connect(process.env.MONGODB_URI!);
		cachedConnection = connection.connection;

		console.log("New mongodb connection established");

		return cachedConnection;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
