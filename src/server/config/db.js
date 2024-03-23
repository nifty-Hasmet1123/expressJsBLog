import mongoose from "mongoose";

/**
 * Asynchronously connects to the MongoDB database using the Mongoose library.
 * @returns {Promise<void>} A promise that resolves when the connection is successfully established.
 */
async function connectDb() {
    try {
        // Disable strict query mode to allow MongoDB to ignore fields not defined in the schema
        mongoose.set("strictQuery", false);
        // Connect to the MongoDB database using the provided URI from environment variables
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        // Log a success message when the connection is established
        console.log(`Database Connected ${conn.connection.host}`);

    } catch (error) {
        console.error(error);
    }
}

export default connectDb;