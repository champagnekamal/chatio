const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },    // Sender's email
    recipient: { type: String, required: true }, // Recipient's email
    message: { type: String, required: true },   // Message content
    timestamp: { type: Date, default: Date.now } // Timestamp of the message
})

const message = mongoose.model('message',messageSchema)
module.exports = message;