import Chat from "../models/Chats";

export const createChat = async (req, res) => {

    try {
        const userId = req.user.id;

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name

        };

        await Chat.create(chatData);
        res.json({success: true, message: "Chat created successfully"});
    } catch (error) {
        res.json({success: false, message: "Error creating chat", error});
    }
};

export const getChats = async (req, res) => {

    try {
        const userId = req.user.id;

        const chats = await Chat.find({userId}).sort({updatedAt: -1});

        res.json({success: true, chats});
    } catch (error) {
        res.json({success: false, message: "Error fetching chats", error});
    }
};

export const deleteChats = async (req, res) => {

    try {
        const userId = req.user.id;

        const {chatId} = req.body;

        await Chat.deleteOne({userId, _id: chatId});

        res.json({success: true, message: "Chat deleted successfully"});
    } catch (error) {
        res.json({success: false, message: "Error deleting chat", error});
    }
};
