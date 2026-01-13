const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    thread: { type: mongoose.Schema.Types.ObjectId, ref: "ChatThread", required: true, index: true },
    senderType: { type: String, enum: ["user", "admin", "system"], required: true, index: true },
    senderUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true, trim: true, maxlength: 2000 }
  },
  { timestamps: true }
);

chatMessageSchema.index({ thread: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);

