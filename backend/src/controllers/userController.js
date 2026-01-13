const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("_id name email phone role isEmailVerified isArchived createdAt");
  res.json({ user });
});

const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body || {};

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (typeof name === "string" && name.trim().length >= 2) {
    user.name = name.trim();
  }
  if (typeof phone === "string") {
    user.phone = phone.trim();
  }
  if (typeof password === "string" && password.trim()) {
    if (password.trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    user.passwordHash = await bcrypt.hash(password.trim(), 10);
  }

  await user.save();

  res.json({
    message: "Profile updated",
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, isEmailVerified: user.isEmailVerified }
  });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { confirmText } = req.body || {};
  if (confirmText !== "Delete") {
    return res.status(400).json({ message: "Please type 'Delete' to confirm account deletion" });
  }

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Archive instead of delete
  user.isArchived = true;
  await user.save();

  res.json({ message: "Account archived successfully" });
});

module.exports = { getMe, updateMe, deleteAccount };

