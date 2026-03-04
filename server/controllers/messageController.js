import Chat from "../models/Chats.js";
import User from "../models/user.js";
import axios from "axios";
import openai from "../configs/openai.js";
import imagekit from "../configs/imagekit.js";

/**
 * @desc    Process text message and save to history
 * @route   POST /api/message/text
 */
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;

        if (req.user.credits < 1) {
            return res.json({ success: false, message: "Insufficient credits to send message" });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat history not found" });
        }

        chat.messages.push({
            role: "user",
            content: prompt,
            timeStamp: Date.now(),
            isImage: false
        });


        const response = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [{ role: "user", content: prompt }],
        });
        const aiContent = response.choices[0].message.content;

        const reply = {
            role: "assistant",
            content: aiContent,
            timeStamp: Date.now(),
            isImage: false
        };
        chat.messages.push(reply);

        await chat.save();

        await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });

        res.json({ success: true, reply });

    } catch (error) {
        console.error("Text Controller Error:", error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * @desc   
 * @route  
 */
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { prompt, chatId, isPublished } = req.body;

        if (req.user.credits < 2) {
            return res.json({ success: false, message: "Insufficient credits to generate image" });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat history not found" });
        }

        chat.messages.push({
            role: "user",
            content: prompt,
            timeStamp: Date.now(),
            isImage: false
        });

        const encodedPrompt = encodeURIComponent(prompt);
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/ROOTGPT/${Date.now()}.png?tr=w-800,h-800`;

        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(aiImageResponse.data, 'binary').toString('base64');

        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "ROOTGPT"
        });

        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timeStamp: Date.now(),
            isImage: true,
            isPublished: isPublished || false
        };

        chat.messages.push(reply);
        await chat.save();

        await User.findByIdAndUpdate(userId, { $inc: { credits: -2 } });

        res.json({ success: true, reply });

    } catch (error) {
        console.error("Image Controller Error:", error);
        res.json({ success: false, message: error.message });
    }
};