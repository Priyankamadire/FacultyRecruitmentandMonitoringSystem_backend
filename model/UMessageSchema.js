const mongoose = require('mongoose');

const usermessSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true // Ensure uniqueness of email addresses
    // },
    // phone: {
    //     type: String, // Change the type to String to support all phone number formats
    //     required: true
    // },
    messages: {
        type: Number,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    receiverEmail: {
        type: String,
        required: true
    }
    
});

const UserMess = mongoose.model('UserMess', usermessSchema);

module.exports = UserMess;
