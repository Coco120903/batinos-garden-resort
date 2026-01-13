const express = require("express");
const { requireAuth, requireRole } = require("../middlewares/auth");
const {
  adminListThreads,
  adminListMessages,
  adminSendMessage,
  adminSetThreadStatus
} = require("../controllers/chatController");

const router = express.Router();

router.get("/threads", requireAuth, requireRole("admin"), adminListThreads);
router.get("/threads/:threadId/messages", requireAuth, requireRole("admin"), adminListMessages);
router.post("/threads/:threadId/messages", requireAuth, requireRole("admin"), adminSendMessage);
router.post("/threads/:threadId/status", requireAuth, requireRole("admin"), adminSetThreadStatus);

module.exports = router;

