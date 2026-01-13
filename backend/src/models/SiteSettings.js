const mongoose = require("mongoose");

const imageItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true }, // e.g. "default"

    system: {
      isBookingOpen: { type: Boolean, default: true },
      maintenanceMessage: { type: String, default: "We are currently updating our system. Please try again later." }
    },

    brand: {
      logoText: { type: String, default: "Batino's Garden Farm Resort", trim: true },
      tagline: { type: String, default: "", trim: true }
    },

    home: {
      heroImages: { type: [imageItemSchema], default: [] },
      highlightsImages: { type: [imageItemSchema], default: [] },
      spacesMoments: { type: [imageItemSchema], default: [] },
      recentEvents: { type: [imageItemSchema], default: [] }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);

