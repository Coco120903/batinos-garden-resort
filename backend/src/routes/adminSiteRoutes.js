const express = require("express");
const { adminGetSiteSettings, adminUpdateSiteSettings } = require("../controllers/siteController");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), adminGetSiteSettings);
router.put("/", requireAuth, requireRole("admin"), adminUpdateSiteSettings);

module.exports = router;

