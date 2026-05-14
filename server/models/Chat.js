const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  id: String,
  name: String,
  lastMsg: String,
  time: String,
  participants: [String], // Array of usernames
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", ChatSchema);
