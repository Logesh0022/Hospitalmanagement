const express = require("express");
const { getPrescriptions, createPrescription, updatePrescription, deletePrescription } = require("../controllers/prescriptionController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getPrescriptions);
router.post("/", protect, authorize("admin", "doctor"), createPrescription);
router.put("/:id", protect, authorize("admin", "doctor"), updatePrescription);
router.delete("/:id", protect, authorize("admin"), deletePrescription);

module.exports = router;
