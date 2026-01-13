const express = require("express");
const { listApprovedReviews, createReview } = require("../controllers/reviewController");
const { requireAuth, requireVerifiedEmail } = require("../middlewares/auth");

const router = express.Router();

router.get("/", listApprovedReviews);
router.post("/", requireAuth, requireVerifiedEmail, createReview);

module.exports = router;

