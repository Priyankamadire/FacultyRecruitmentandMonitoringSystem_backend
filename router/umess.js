const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');
const Clg = require('../model/clgSchema');
const Message = require('../model/UMessageSchema')
router.post('/send-message', async (req, res) => {
    try {
      const { senderId, receiverEmail, message } = req.body;
  
      // Find the sender user by ID
      const senderUser = await User.findById(senderId);
      if (!senderUser) {
        return res.status(404).json({ error: 'Sender user not found' });
      }
  
      // Find the receiver user by email (assuming email is unique)
      const receiverUser = await Clg.findOne({ clgemail: receiverEmail });
      if (!receiverUser) {
        return res.status(404).json({ error: 'Receiver user not found' });
      }
    
      // Create a new message instance
      const newMessage = new Message({
       
        senderId: senderId,
        receiverEmail: receiverEmail,
        message: message
      });
  
      // Save the new message to the database
      await newMessage.save();
  
      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
