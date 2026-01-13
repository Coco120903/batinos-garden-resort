const express = require("express");
const { adminListReviews, adminApproveReview, adminRejectReview } = require("../controllers/reviewController");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), adminListReviews);
router.post("/:id/approve", requireAuth, requireRole("admin"), adminApproveReview);
router.delete("/:id", requireAuth, requireRole("admin"), adminRejectReview);

module.exports = router;

