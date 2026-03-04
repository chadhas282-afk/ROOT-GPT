import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import {textMessageController , imageMessageController} from '../controllers/messageController.js';

const messageRoutes = express.Router();

messageRoutes.post('/text', protect, textMessageController);
messageRoutes.post('/image', protect, imageMessageController);

export default messageRoutes;