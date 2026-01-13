const mongoose = require("mongoose");

const bookingExtraSchema = new mongoose.Schema(
  {
    extraCode: { type: String, required: true, trim: true },
    pricingKey: { type: String, required: true, trim: true }, // e.g. "12h", "22h", "flat"
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },

    // Selected package option (optional for simple services)
    serviceOptionId: { type: mongoose.Schema.Types.ObjectId },

    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Completed", "Cancelled"],
      default: "Pending",
      index: true
    },

    eventType: {
      type: String,
      enum: ["Family Gathering", "Birthday", "Reunion", "Wedding", "Team Building", "Special Occasion", "Other"],
      default: "Other"
    },
    eventTypeOther: { type: String, default: "" },
    paxCount: { type: Number, default: 1, min: 1 },

    notes: { type: String, default: "" },

    // price snapshot (important for production systems)
    pricing: {
      basePrice: { type: Number, default: 0, min: 0 },
      excessPaxFee: { type: Number, default: 0, min: 0 },
      extrasTotal: { type: Number, default: 0, min: 0 },
      total: { type: Number, default: 0, min: 0 }
    },
    extras: { type: [bookingExtraSchema], default: [] },

    // audit fields (admin actions)
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cancellationReason: { type: String, default: "" }
  },
  { timestamps: true }
);

// Common admin dashboard queries:
bookingSchema.index({ status: 1, startAt: -1 });
bookingSchema.index({ user: 1, startAt: -1 });
bookingSchema.index({ service: 1, startAt: -1 });
bookingSchema.index({ createdAt: -1 }); // For recent bookings
bookingSchema.index({ startAt: 1, endAt: 1 }); // For date range queries
bookingSchema.index({ eventType: 1 }); // For event type analytics

module.exports = mongoose.model("Booking", bookingSchema);

