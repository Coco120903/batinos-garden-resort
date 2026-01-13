const express = require("express");

const { listPublicServices, createService, updateService } = require("../controllers/serviceController");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

// Public:
router.get("/", listPublicServices);

// Admin (we'll add auth + role middleware next step):
router.post("/", requireAuth, requireRole("admin"), createService);
router.patch("/:id", requireAuth, requireRole("admin"), updateService);

module.exports = router;

