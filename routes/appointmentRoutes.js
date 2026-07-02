const express = require("express");
const { getAppointments, createAppointment, updateAppointment, deleteAppointment } = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getAppointments);
router.post("/", protect, authorize("admin", "patient"), createAppointment);
router.put("/:id", protect, authorize("admin", "doctor"), updateAppointment);
router.delete("/:id", protect, authorize("admin"), deleteAppointment);

module.exports = router;
