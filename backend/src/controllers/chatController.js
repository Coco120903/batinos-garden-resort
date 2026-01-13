const ChatThread = require("../models/ChatThread");
const ChatMessage = require("../models/ChatMessage");
const { asyncHandler } = require("../utils/asyncHandler");

async function getOrCreateThreadForUser(userId) {
  let thread = await ChatThread.findOne({ user: userId });
  if (!thread) {
    thread = await ChatThread.create({ user: userId, status: "open", lastMessageAt: new Date() });
    // Auto-reply welcome message (system)
    await ChatMessage.create({
      thread: thread._id,
      senderType: "system",
      text: "Thanks for reaching out! We received your message. Our team will get back to you as soon as possible."
    });
  }
  return thread;
}

// User: get my thread + latest messages
const userGetMyThread = asyncHandler(async (req, res) => {
  const thread = await getOrCreateThreadForUser(req.user._id);
  res.json({ thread });
});

const userListMessages = asyncHandler(async (req, res) => {
  const thread = await getOrCreateThreadForUser(req.user._id);
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const messages = await ChatMessage.find({ thread: thread._id }).sort({ createdAt: 1 }).limit(limit);
  res.json({ threadId: thread._id, messages });
});

const userSendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body || {};
  if (!text || !String(text).trim()) return res.status(400).json({ message: "text is required" });

  const thread = await getOrCreateThreadForUser(req.user._id);
  if (thread.status === "closed") {
    return res.status(403).json({ message: "Chat is closed. Please try again later." });
  }

  const msg = await ChatMessage.create({
    thread: thread._id,
    senderType: "user",
    senderUser: req.user._id,
    text: String(text).trim()
  });

  thread.lastMessageAt = new Date();
  await thread.save();

  res.status(201).json({ message: "Sent", msg });
});

// Admin: list threads
const adminListThreads = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const status = req.query.status;
  const query = {};
  if (status) query.status = status;
  const threads = await ChatThread.find(query)
    .populate("user", "name email")
    .sort({ lastMessageAt: -1 })
    .limit(limit);
  res.json({ threads });
});

const adminListMessages = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  const limit = Math.min(Number(req.query.limit) || 100, 300);
  const messages = await ChatMessage.find({ thread: threadId }).sort({ createdAt: 1 }).limit(limit);
  res.json({ threadId, messages });
});

const adminSendMessage = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  const { text } = req.body || {};
  if (!text || !String(text).trim()) return res.status(400).json({ message: "text is required" });

  const thread = await ChatThread.findById(threadId);
  if (!thread) return res.status(404).json({ message: "Thread not found" });

  const msg = await ChatMessage.create({
    thread: thread._id,
    senderType: "admin",
    senderUser: req.user._id,
    text: String(text).trim()
  });

  thread.lastMessageAt = new Date();
  await thread.save();

  res.status(201).json({ message: "Sent", msg });
});

const adminSetThreadStatus = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  const { status } = req.body || {};
  if (!["open", "closed"].includes(status)) return res.status(400).json({ message: "Invalid status" });

  const thread = await ChatThread.findById(threadId);
  if (!thread) return res.status(404).json({ message: "Thread not found" });
  thread.status = status;
  await thread.save();
  res.json({ message: "Updated", thread });
});

module.exports = {
  userGetMyThread,
  userListMessages,
  userSendMessage,
  adminListThreads,
  adminListMessages,
  adminSendMessage,
  adminSetThreadStatus
};

