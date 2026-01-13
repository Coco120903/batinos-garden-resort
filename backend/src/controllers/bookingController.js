const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

/**
 * Create a new booking (user only, requires verified email)
 */
const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, serviceOptionId, startAt, endAt, eventType, eventTypeOther, paxCount, notes, extras } = req.body;
  const userId = req.user._id;

  // Validate required fields
  if (!serviceId || !startAt || !endAt) {
    return res.status(400).json({ message: "Service, start date, and end date are required" });
  }

  // If system is in maintenance mode, block booking creation
  // (Login remains available via maintenance middleware)
  const SiteSettings = require("../models/SiteSettings");
  const settings = await SiteSettings.findOne({ key: "default" }).select("system");
  if (settings && settings.system && settings.system.isBookingOpen === false) {
    return res.status(503).json({
      message: settings.system.maintenanceMessage || "System is temporarily unavailable. Please try again later.",
      code: "MAINTENANCE_MODE"
    });
  }

  // Get service with options
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  // Double-booking prevention (overlap check)
  // Block overlaps for the same service for Pending/Approved bookings
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
    return res.status(400).json({ message: "Invalid start/end date" });
  }

  const overlap = await Booking.findOne({
    service: serviceId,
    status: { $in: ["Pending", "Approved"] },
    startAt: { $lt: endDate },
    endAt: { $gt: startDate }
  }).select("_id startAt endAt status");

  if (overlap) {
    return res.status(409).json({
      message: "Selected schedule is not available. Please choose another date/time.",
      conflict: overlap
    });
  }

  // Find selected option if provided
  let selectedOption = null;
  if (serviceOptionId && service.options.length > 0) {
    selectedOption = service.options.id(serviceOptionId);
    if (!selectedOption) {
      return res.status(404).json({ message: "Service option not found" });
    }
  }

  // Calculate pricing
  let basePrice = 0;
  let excessPaxFee = 0;
  let extrasTotal = 0;

  if (selectedOption) {
    basePrice = selectedOption.basePrice;
    const includedPax = selectedOption.includedPax || 25;
    if (paxCount > includedPax) {
      excessPaxFee = (paxCount - includedPax) * (selectedOption.excessPaxFee || 0);
    }
  } else {
    basePrice = service.price || 0;
  }

  // Calculate extras total
  if (extras && Array.isArray(extras)) {
    extras.forEach((extra) => {
      const serviceExtra = service.extras.find((e) => e.code === extra.extraCode);
      if (serviceExtra) {
        const pricing = serviceExtra.pricing.find((p) => p.key === extra.pricingKey);
        if (pricing) {
          extrasTotal += pricing.price * (extra.quantity || 1);
        }
      }
    });
  }

  const total = basePrice + excessPaxFee + extrasTotal;

  // Create booking
  const booking = await Booking.create({
    user: userId,
    service: serviceId,
    serviceOptionId: selectedOption?._id,
    startAt: startDate,
    endAt: endDate,
    eventType: eventType || "Other",
    eventTypeOther: eventTypeOther || "",
    paxCount: paxCount || 1,
    notes: notes || "",
    extras: extras || [],
    pricing: {
      basePrice,
      excessPaxFee,
      extrasTotal,
      total,
    },
    status: "Pending",
  });

  // Populate user and service for response
  await booking.populate("user", "name email");
  await booking.populate("service", "name");

  res.status(201).json({
    message: "Booking created successfully",
    booking,
  });
});

/**
 * Get current user's bookings
 */
const listMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const bookings = await Booking.find({ user: userId })
    .populate("service", "name category")
    .sort({ startAt: -1 });

  res.json({ bookings });
});

/**
 * Admin: Get all bookings with filters
 */
const adminListBookings = asyncHandler(async (req, res) => {
  const { status, serviceId, startDate, endDate, page = 1, limit = 50 } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }
  if (serviceId) {
    query.service = serviceId;
  }
  if (startDate || endDate) {
    query.startAt = {};
    if (startDate) query.startAt.$gte = new Date(startDate);
    if (endDate) query.startAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const bookings = await Booking.find(query)
    .populate("user", "name email phone")
    .populate("service", "name category")
    .sort({ startAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Booking.countDocuments(query);

  res.json({
    bookings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * Admin: Approve booking
 */
const adminApproveBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user._id;

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status !== "Pending") {
    return res.status(400).json({ message: `Cannot approve booking with status: ${booking.status}` });
  }

  booking.status = "Approved";
  booking.approvedBy = adminId;
  await booking.save();

  await booking.populate("user", "name email");
  await booking.populate("service", "name");

  res.json({
    message: "Booking approved successfully",
    booking,
  });
});

/**
 * Admin: Reschedule booking
 */
const adminRescheduleBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startAt, endAt, notes } = req.body;

  if (!startAt || !endAt) {
    return res.status(400).json({ message: "Start date and end date are required" });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status === "Cancelled" || booking.status === "Completed") {
    return res.status(400).json({ message: `Cannot reschedule booking with status: ${booking.status}` });
  }

  booking.startAt = new Date(startAt);
  booking.endAt = new Date(endAt);
  if (notes) {
    booking.notes = (booking.notes || "") + "\n[Rescheduled] " + notes;
  }
  await booking.save();

  await booking.populate("user", "name email");
  await booking.populate("service", "name");

  res.json({
    message: "Booking rescheduled successfully",
    booking,
  });
});

/**
 * Admin: Cancel booking
 */
const adminCancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const adminId = req.user._id;

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status === "Cancelled") {
    return res.status(400).json({ message: "Booking is already cancelled" });
  }

  if (booking.status === "Completed") {
    return res.status(400).json({ message: "Cannot cancel a completed booking" });
  }

  booking.status = "Cancelled";
  booking.cancelledBy = adminId;
  booking.cancellationReason = reason || "";
  await booking.save();

  await booking.populate("user", "name email");
  await booking.populate("service", "name");

  res.json({
    message: "Booking cancelled successfully",
    booking,
  });
});

/**
 * Admin: Mark booking as completed
 */
const adminCompleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status === "Cancelled") {
    return res.status(400).json({ message: "Cannot complete a cancelled booking" });
  }

  if (booking.status === "Completed") {
    return res.status(400).json({ message: "Booking is already completed" });
  }

  booking.status = "Completed";
  await booking.save();

  await booking.populate("user", "name email");
  await booking.populate("service", "name");

  res.json({
    message: "Booking marked as completed",
    booking,
  });
});

module.exports = {
  createBooking,
  listMyBookings,
  adminListBookings,
  adminApproveBooking,
  adminRescheduleBooking,
  adminCancelBooking,
  adminCompleteBooking,
};
