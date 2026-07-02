const express = require("express");
const { getPatients, createPatient, updatePatient, deletePatient } = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, authorize("admin", "doctor"), getPatients);
router.post("/", protect, authorize("admin"), createPatient);
router.put("/:id", protect, authorize("admin"), updatePatient);
router.delete("/:id", protect, authorize("admin"), deletePatient);

module.exports = router;
