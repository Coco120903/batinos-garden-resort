const express = require("express");

const {
  createBooking,
  listMyBookings,
  adminListBookings,
  adminApproveBooking,
  adminRescheduleBooking,
  adminCancelBooking,
  adminCompleteBooking
} = require("../controllers/bookingController");
const { requireAuth, requireRole, requireVerifiedEmail } = require("../middlewares/auth");

const router = express.Router();

// User (we'll add auth middleware next step):
router.post("/", requireAuth, requireVerifiedEmail, createBooking);
router.get("/mine", requireAuth, listMyBookings);

// Admin (we'll add role middleware next step):
router.get("/", requireAuth, requireRole("admin"), adminListBookings);
router.post("/:id/approve", requireAuth, requireRole("admin"), adminApproveBooking);
router.post("/:id/reschedule", requireAuth, requireRole("admin"), adminRescheduleBooking);
router.post("/:id/cancel", requireAuth, requireRole("admin"), adminCancelBooking);
router.post("/:id/complete", requireAuth, requireRole("admin"), adminCompleteBooking);

module.exports = router;

