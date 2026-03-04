import User from "../models/user.js"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Chat from "../models/Chats.js";
import { Images } from "openai/resources/images.mjs";


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
export const registerUser = async (req, res) => {
    try {
        console.log("Incoming Body:", req.body);
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Empty request body. Did you set Content-Type to application/json?" 
            });
        }
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }
        
        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);
        
        res.json({ 
            success: true, 
            token, 
            user: { name: user.name, email: user.email, credits: user.credits } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);
            return res.json({ 
                success: true, 
                token, 
                user: { name: user.name, email: user.email, credits: user.credits } 
            });
        }
        
        return res.json({ success: false, message: "Invalid email or password" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        return res.json({ success: true, user: req.user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPublishedImages = async (req, res) => {
    try {
        const publishedImagesMessages = await Chat.aggregate([
            {$unwind: "$messages"},
            {$match: {"messages.isPublished": true,
            "messages.isImage": true}},
            {$project: {
                _id: 0,
                imageUrl: "$messages.content",
                userName: "$user.name"
            }}
        ]);
        res.json({ success: true, Images: publishedImagesMessages.reverse() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
