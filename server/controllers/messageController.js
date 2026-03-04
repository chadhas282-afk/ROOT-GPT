import Chat from "../models/Chats.js";
import User from "../models/user.js";
import axios from "axios";
import imagekit from "../configs/imagekit.js";

export const textMessageController = {
    sendMessage: async (req, res) => {
        try {
            const userId = req.user._id;
            const { chatId, content } = req.body;

            const chat = await Chat.findOne({
                userId, _id: chatId
            });
            chat.messages.push({
                role: "user", content: prompt, timestamp: Date.now(),
                isImage: false
            })

            const { choices } = await openai.chat.completions.create({
                model: "gemini-3-flash-preview",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });

            const reply = {...choices[0].messages, timestamp: Date.now(),
                isImage: false}

            res.json({success: true, reply});

            chat.messages.push(reply);
            await chat.save();
            await User.updateOne({_id: userId}, {$inc: {credits: -1}})

        } catch (error) {
            res.json({success: false, message: error.message});
        }
    }
};

export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
       if(req.user.credits < 2){
        return res.json({success: false, message: "Insufficient credits to generate image"});
       }
       const {prompt, chatId, isPublished} = req.body;
       const chat = await Chat.findOne({
           userId, _id: chatId
       });
       chat.messages.push({
           role: "user", content: prompt, timestamp: Date.now(),
           isImage: false
       });
       const encodedPrompt = encodeURIComponent(prompt);
       const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/ROOTGPT/${Date.now()}.png?tr=w-800,h-800`;

     const aiImageResponse =   await axios.get(generatedImageUrl, {responseType: 'arraybuffer'});

     const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;

     const uploadResponse = await imagekit.upload({
         file: base64Image,
         fileName: `${Date.now()}.png`,
         folder: "ROOTGPT"
     });

     const reply = {
         role: "assistant",
         content: uploadResponse.url,
         timestamp: Date.now(),
         isImage: true,
         isPublished
     };

     res.json({success: true, reply});
     chat.messages.push(reply);
     await chat.save();
     await User.updateOne({_id: userId}, {$inc: {credits: -2}});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
};
