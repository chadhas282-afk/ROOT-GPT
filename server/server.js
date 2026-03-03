import 'dotenv/config'; // MUST be the first line
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is live");
});

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
};

startServer();