const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { getMe, updateMe, deleteAccount } = require("../controllers/userController");

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.delete("/me", requireAuth, deleteAccount);

module.exports = router;

