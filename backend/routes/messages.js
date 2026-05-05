const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

// Get conversations for user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.params.userId }, { receiverId: req.params.userId }]
    }).sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages between two users
router.get('/:userId1/:userId2', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId1, receiverId: req.params.userId2 },
        { senderId: req.params.userId2, receiverId: req.params.userId1 }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId, itemId, content, senderName } = req.body;
    
    const message = new Message({
      senderId: req.userId,
      senderName,
      receiverId,
      itemId,
      content
    });
    
    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.put('/:messageId/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { read: true },
      { new: true }
    );
    
    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;