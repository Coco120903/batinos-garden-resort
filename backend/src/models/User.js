const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, default: "" },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
    isEmailVerified: { type: Boolean, default: false, index: true },
    emailVerification: {
      tokenHash: { type: String, default: "" },
      expiresAt: { type: Date }
    },
    passwordReset: {
      tokenHash: { type: String, default: "" },
      expiresAt: { type: Date }
    },
    isArchived: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

// Additional indexes for common queries
// Note: email already has unique: true which creates an index automatically
userSchema.index({ createdAt: -1 }); // For admin user lists

module.exports = mongoose.model("User", userSchema);

