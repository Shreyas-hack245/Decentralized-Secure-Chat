const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  username: String,
  text: String,
  chatId: {
    type: String,
    default: "global",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Message",
  MessageSchema
);