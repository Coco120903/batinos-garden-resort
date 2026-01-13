const express = require("express");
const { publicGetSiteSettings } = require("../controllers/siteController");

const router = express.Router();

router.get("/", publicGetSiteSettings);

module.exports = router;

