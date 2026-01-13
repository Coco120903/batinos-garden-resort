const express = require("express");
const { requireAuth, requireVerifiedEmail } = require("../middlewares/auth");
const { userGetMyThread, userListMessages, userSendMessage } = require("../controllers/chatController");

const router = express.Router();

router.get("/me", requireAuth, requireVerifiedEmail, userGetMyThread);
router.get("/me/messages", requireAuth, requireVerifiedEmail, userListMessages);
router.post("/me/messages", requireAuth, requireVerifiedEmail, userSendMessage);

module.exports = router;

