const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

/**
 * Get dashboard analytics (admin only)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.startAt = {};
    if (startDate) dateFilter.startAt.$gte = new Date(startDate);
    if (endDate) dateFilter.startAt.$lte = new Date(endDate);
  }

  // Total bookings
  const totalBookings = await Booking.countDocuments(dateFilter);

  // Bookings by status
  const bookingsByStatus = await Booking.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Revenue calculations
  const revenueData = await Booking.aggregate([
    { $match: { ...dateFilter, status: { $in: ["Approved", "Completed"] } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$pricing.total" },
        averageBooking: { $avg: "$pricing.total" },
        count: { $sum: 1 },
      },
    },
  ]);

  // Bookings by service
  const bookingsByService = await Booking.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$service",
        count: { $sum: 1 },
        revenue: { $sum: "$pricing.total" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Populate service names
  const serviceIds = bookingsByService.map((b) => b._id);
  const services = await Service.find({ _id: { $in: serviceIds } }).select("name");
  const serviceMap = {};
  services.forEach((s) => {
    serviceMap[s._id.toString()] = s.name;
  });

  const bookingsByServiceWithNames = bookingsByService.map((b) => ({
    serviceId: b._id,
    serviceName: serviceMap[b._id.toString()] || "Unknown",
    count: b.count,
    revenue: b.revenue,
  }));

  // Recent bookings (last 10)
  const recentBookings = await Booking.find(dateFilter)
    .populate("user", "name email")
    .populate("service", "name")
    .sort({ createdAt: -1 })
    .limit(10)
    .select("_id status startAt endAt eventType paxCount pricing.total user service");

  // Monthly trend (last 12 months)
  const monthlyTrend = await Booking.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: {
          year: { $year: "$startAt" },
          month: { $month: "$startAt" },
        },
        count: { $sum: 1 },
        revenue: { $sum: "$pricing.total" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $limit: 12 },
  ]);

  // Event type distribution
  const eventTypeDistribution = await Booking.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$eventType",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const stats = {
    overview: {
      totalBookings,
      pending: bookingsByStatus.find((s) => s._id === "Pending")?.count || 0,
      approved: bookingsByStatus.find((s) => s._id === "Approved")?.count || 0,
      completed: bookingsByStatus.find((s) => s._id === "Completed")?.count || 0,
      cancelled: bookingsByStatus.find((s) => s._id === "Cancelled")?.count || 0,
    },
    revenue: revenueData[0] || {
      totalRevenue: 0,
      averageBooking: 0,
      count: 0,
    },
    bookingsByService: bookingsByServiceWithNames,
    recentBookings,
    monthlyTrend: monthlyTrend.map((m) => ({
      month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
      count: m.count,
      revenue: m.revenue,
    })),
    eventTypeDistribution,
  };

  res.json(stats);
});

/**
 * Get booking statistics for a specific date range
 */
const getBookingStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start date and end date are required" });
  }

  const bookings = await Booking.find({
    startAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  })
    .populate("service", "name")
    .populate("user", "name email");

  const stats = {
    total: bookings.length,
    byStatus: {},
    byService: {},
    totalRevenue: 0,
    averagePax: 0,
  };

  let totalPax = 0;

  bookings.forEach((booking) => {
    // By status
    stats.byStatus[booking.status] = (stats.byStatus[booking.status] || 0) + 1;

    // By service
    const serviceName = booking.service?.name || "Unknown";
    stats.byService[serviceName] = (stats.byService[serviceName] || 0) + 1;

    // Revenue (only approved/completed)
    if (booking.status === "Approved" || booking.status === "Completed") {
      stats.totalRevenue += booking.pricing.total || 0;
    }

    // Pax
    totalPax += booking.paxCount || 0;
  });

  stats.averagePax = bookings.length > 0 ? totalPax / bookings.length : 0;

  res.json(stats);
});

module.exports = {
  getDashboardStats,
  getBookingStats,
};
