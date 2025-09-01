import express from 'express';
import Message from '../models/messageModel.js';

const router = express.Router();

// @desc    Mendapatkan semua pesan dari sebuah room
// @route   GET /api/chat/:roomName/messages
router.get('/:roomName/messages', async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.roomName }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil pesan' });
    }
});

export default router;