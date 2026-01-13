const express = require("express");
const { getDashboardStats, getBookingStats } = require("../controllers/analyticsController");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

// All analytics routes require admin role
router.get("/dashboard", requireAuth, requireRole("admin"), getDashboardStats);
router.get("/bookings", requireAuth, requireRole("admin"), getBookingStats);

module.exports = router;
