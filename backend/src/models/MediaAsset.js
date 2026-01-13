const mongoose = require("mongoose");

const mediaAssetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    title: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

mediaAssetSchema.index({ createdAt: -1 });
mediaAssetSchema.index({ tags: 1 });
mediaAssetSchema.index({ url: 1 }, { unique: true });

module.exports = mongoose.model("MediaAsset", mediaAssetSchema);

