import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

app.get("/", (req, res) => {
    res.send("Server is live");
});
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
};

startServer();