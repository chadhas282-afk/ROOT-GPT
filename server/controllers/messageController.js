import Chat from "../models/Chats.js";


export const textMessageController = {
    sendMessage: async (req, res) => {
        try {
            const userId = req.user._id;
            const { chatId, content } = req.body;

            const chat = await Chat.findOne({
                userId, _id: chatId});
                chat.messages.push({role: "user", content: prompt, timestamp: Date.now(),
                isImage: false}) 
                
        } catch (error) {
            
        }
    }
};
