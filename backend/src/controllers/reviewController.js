const Review = require("../models/Review");
const { asyncHandler } = require("../utils/asyncHandler");

const listApprovedReviews = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query || {};
  const items = await Review.find({ isApproved: true })
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 8, 30))
    .select("name rating comment createdAt");
  res.json({ items });
});

const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body || {};
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (!rating || !comment) return res.status(400).json({ message: "rating and comment are required" });

  const doc = await Review.create({
    user: user._id,
    name: user.name || user.email,
    rating: Number(rating),
    comment: String(comment).trim(),
    isApproved: false
  });

  res.status(201).json({ message: "Review submitted for approval", reviewId: doc._id });
});

const adminListReviews = asyncHandler(async (req, res) => {
  const { status = "pending", limit = 50 } = req.query || {};
  const query = {};
  if (status === "approved") query.isApproved = true;
  if (status === "pending") query.isApproved = false;

  const items = await Review.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 50, 200));
  res.json({ items });
});

const adminApproveReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doc = await Review.findById(id);
  if (!doc) return res.status(404).json({ message: "Review not found" });
  doc.isApproved = true;
  doc.approvedBy = req.user?._id;
  await doc.save();
  res.json({ message: "Approved", id });
});

const adminRejectReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doc = await Review.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: "Review not found" });
  res.json({ message: "Rejected (deleted)", id });
});

module.exports = { listApprovedReviews, createReview, adminListReviews, adminApproveReview, adminRejectReview };

