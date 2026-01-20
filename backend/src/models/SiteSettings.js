const mongoose = require("mongoose");

const imageItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const eventItemSchema = new mongoose.Schema(
  {
    thumbnail: { type: String, required: true, trim: true }, // Main thumbnail image URL
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    images: { type: [String], default: [] } // Array of additional image URLs
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
      recentEvents: { type: [eventItemSchema], default: [] }, // Changed to eventItemSchema
      villa1Images: { type: [imageItemSchema], default: [] },
      villa2Images: { type: [imageItemSchema], default: [] },
      villa3Images: { type: [imageItemSchema], default: [] }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);

