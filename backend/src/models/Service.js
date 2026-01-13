const mongoose = require("mongoose");

const serviceOptionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true }, // e.g. DAY, NIGHT, FULL_22H
    name: { type: String, required: true, trim: true }, // e.g. Day (8am–5pm)
    durationHours: { type: Number, required: true, min: 1 },
    startTimeLabel: { type: String, default: "" }, // display only (we still book by startAt/endAt)
    basePrice: { type: Number, required: true, min: 0 },
    includedPax: { type: Number, default: 0, min: 0 },
    excessPaxFee: { type: Number, default: 0, min: 0 }, // per pax over included
    notes: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { _id: true }
);

const serviceExtraSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true }, // e.g. APPLIANCE_FEE, GAS_RANGE, CORKAGE
    name: { type: String, required: true, trim: true },
    pricing: [
      {
        // flexible: "12h", "22h", "flat", etc.
        key: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 }
      }
    ],
    notes: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { _id: true }
);

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["service", "room", "facility", "amenity"],
      default: "service",
      index: true
    },
    durationMinutes: { type: Number, required: true, min: 15 },
    price: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    images: [{ type: String }],

    // For resort package deals (day/night/22hours):
    options: { type: [serviceOptionSchema], default: [] },

    // Extras (e.g. corkage, appliance fees) maintained by admin:
    extras: { type: [serviceExtraSchema], default: [] }
  },
  { timestamps: true }
);

serviceSchema.index({ name: 1, category: 1 }, { unique: true });
serviceSchema.index({ isActive: 1, category: 1 }); // For public service listings
serviceSchema.index({ createdAt: -1 }); // For admin service management

module.exports = mongoose.model("Service", serviceSchema);

