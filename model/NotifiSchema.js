// NotifiSchema.js
const mongoose = require('mongoose');

const notifiSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['hire', 'reject'] // Only allow 'hire' or 'reject' as values
    },
    jobid:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notifiSchema);

module.exports = Notification;
