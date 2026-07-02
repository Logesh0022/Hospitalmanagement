const express = require("express");
const { getProfile, updateProfile, updateSettings, changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/settings", protect, updateSettings);
router.put("/change-password", protect, changePassword);

module.exports = router;
