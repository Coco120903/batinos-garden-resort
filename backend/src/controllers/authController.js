const { asyncHandler } = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signAccessToken } = require("../utils/jwt");
const { sendEmail } = require("../utils/mailer");
const { generateVerificationToken, hashToken, getExpiryDate } = require("../utils/emailVerification");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body || {};
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email, password are required");
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() }).select("_id");
  if (existing) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();
  const tokenHash = hashToken(verificationToken);

  const user = await User.create({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    phone: phone ? String(phone).trim() : "",
    passwordHash,
    role: "user",
    isEmailVerified: false,
    emailVerification: { tokenHash, expiresAt: getExpiryDate(30) }
  });

  // In production, this should use your frontend URL (e.g. https://batinos.../verify-email?token=...&email=...)
  const apiBase = process.env.PUBLIC_API_BASE_URL || `http://localhost:${process.env.PORT || 5001}`;
  const verifyUrl = `${apiBase}/api/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(
    user.email
  )}`;

  // Try to send email, but don't fail registration if email fails
  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your email - Batino's Booking",
      html: `<p>Hello ${user.name},</p>
             <p>Please verify your email to start booking:</p>
             <p><a href="${verifyUrl}">Verify Email</a></p>
             <p>This link expires in 30 minutes.</p>
             <hr />
             <p style="color:#475569;font-size:13px;">
               Privacy promise: We respect your privacy. We will never sell your personal information.
             </p>`
    });
  } catch (emailError) {
    // Log but continue - user can request resend later
    console.error("Failed to send verification email:", emailError.message);
  }

  res.status(201).json({
    message: "Registered. Please verify your email.",
    userId: user._id,
    emailSent: true
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token, email } = req.query || {};
  if (!token || !email) {
    res.status(400);
    throw new Error("token and email are required");
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.isEmailVerified) {
    return res.json({ message: "Email already verified" });
  }

  const tokenHash = hashToken(String(token));
  if (!user.emailVerification?.tokenHash || user.emailVerification.tokenHash !== tokenHash) {
    res.status(400);
    throw new Error("Invalid verification token");
  }
  if (user.emailVerification.expiresAt && user.emailVerification.expiresAt.getTime() < Date.now()) {
    res.status(400);
    throw new Error("Verification token expired");
  }

  user.isEmailVerified = true;
  user.emailVerification = { tokenHash: "", expiresAt: undefined };
  await user.save();

  res.json({ message: "Email verified successfully" });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required");
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    res.status(403);
    throw new Error("Please verify your email before logging in");
  }

  const token = signAccessToken({ userId: user._id, role: user.role });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    res.status(400);
    throw new Error("email is required");
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim(), isArchived: false });
  if (!user) {
    // Don't reveal if email exists - security best practice
    return res.json({ message: "If email exists, reset link has been sent" });
  }

  const resetToken = generateVerificationToken();
  const tokenHash = hashToken(resetToken);
  user.passwordReset = { tokenHash, expiresAt: getExpiryDate(30) };
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontendUrl}/forgot-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your password - Batino's Booking",
      html: `<p>Hello ${user.name},</p>
             <p>You requested to reset your password. Click the link below:</p>
             <p><a href="${resetUrl}">Reset Password</a></p>
             <p>This link expires in 30 minutes.</p>
             <p>If you didn't request this, please ignore this email.</p>
             <hr />
             <p style="color:#475569;font-size:13px;">
               Privacy promise: We respect your privacy. We will never sell your personal information.
             </p>`
    });
  } catch (emailError) {
    console.error("Failed to send password reset email:", emailError.message);
  }

  res.json({ message: "If email exists, reset link has been sent" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, email, password } = req.body || {};
  if (!token || !email || !password) {
    res.status(400);
    throw new Error("token, email, and password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim(), isArchived: false });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const tokenHash = hashToken(String(token));
  if (!user.passwordReset?.tokenHash || user.passwordReset.tokenHash !== tokenHash) {
    res.status(400);
    throw new Error("Invalid reset token");
  }
  if (user.passwordReset.expiresAt && user.passwordReset.expiresAt.getTime() < Date.now()) {
    res.status(400);
    throw new Error("Reset token expired");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  user.passwordHash = passwordHash;
  user.passwordReset = { tokenHash: "", expiresAt: undefined };
  await user.save();

  res.json({ message: "Password reset successfully" });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { register, verifyEmail, login, forgotPassword, resetPassword, me };

