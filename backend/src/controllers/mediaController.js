const MediaAsset = require("../models/MediaAsset");
const { asyncHandler } = require("../utils/asyncHandler");

const adminListMedia = asyncHandler(async (req, res) => {
  const { q = "", tag = "", limit = 100 } = req.query || {};
  const query = {};
  if (q) query.$or = [{ title: new RegExp(q, "i") }, { url: new RegExp(q, "i") }];
  if (tag) query.tags = tag;

  const items = await MediaAsset.find(query).sort({ createdAt: -1 }).limit(Math.min(Number(limit) || 100, 200));
  res.json({ items });
});

const adminCreateMedia = asyncHandler(async (req, res) => {
  const { url, title = "", tags = [] } = req.body || {};
  if (!url) {
    return res.status(400).json({ message: "url is required" });
  }

  const cleanTags = Array.isArray(tags)
    ? tags
        .map((t) => String(t).trim())
        .filter(Boolean)
        .slice(0, 20)
    : [];

  const item = await MediaAsset.create({
    url: String(url).trim(),
    title: String(title || "").trim(),
    tags: cleanTags,
    createdBy: req.user?._id
  });

  res.status(201).json({ item });
});

const adminDeleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await MediaAsset.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ message: "Media not found" });
  res.json({ message: "Deleted", id });
});

module.exports = { adminListMedia, adminCreateMedia, adminDeleteMedia };

