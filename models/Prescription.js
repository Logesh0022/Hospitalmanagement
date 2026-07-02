const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, default: "" },
  duration: { type: String, default: "" },
  instructions: { type: String, default: "" }
});

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    diagnosis: { type: String, required: true },
    symptoms: { type: String, default: "" },
    medicines: [medicineSchema],
    advice: { type: String, default: "" },
    followUpDate: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
