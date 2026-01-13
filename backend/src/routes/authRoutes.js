const express = require("express");

const { register, verifyEmail, login, forgotPassword, resetPassword, me } = require("../controllers/authController");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

// Public:
router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail); // token in querystring
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected (we'll add auth middleware next step):
router.get("/me", requireAuth, me);

module.exports = router;

