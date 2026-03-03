import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    try {
        mongoose.connection.on("connected", () => {
            console.log("✅ Database connected successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ Database connection error:", err);
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/root-gpt`); 
        
    } catch (error) {
        console.error("Critical Database Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;