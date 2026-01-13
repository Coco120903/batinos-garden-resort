const express = require("express");
const { adminListMedia, adminCreateMedia, adminDeleteMedia } = require("../controllers/mediaController");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), adminListMedia);
router.post("/", requireAuth, requireRole("admin"), adminCreateMedia);
router.delete("/:id", requireAuth, requireRole("admin"), adminDeleteMedia);

module.exports = router;

