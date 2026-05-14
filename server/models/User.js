const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: String,
    default: "SecureChat user. Privacy enthusiast.",
  },
  settings: {
    notifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: true },
    privacyLock: { type: Boolean, default: false },
    autoDelete: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
