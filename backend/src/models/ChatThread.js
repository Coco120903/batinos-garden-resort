const mongoose = require("mongoose");

const chatThreadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    status: { type: String, enum: ["open", "closed"], default: "open", index: true },
    lastMessageAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

chatThreadSchema.index({ status: 1, lastMessageAt: -1 });

module.exports = mongoose.model("ChatThread", chatThreadSchema);

