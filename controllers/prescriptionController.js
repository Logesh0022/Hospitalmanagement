const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

const populateFields = [
  { path: "patient", select: "name email phone age gender" },
  { path: "doctor", select: "name specialization department" },
  { path: "appointment", select: "date time reason status" }
];

exports.getPrescriptions = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "doctor") filter.doctor = req.user._id;
    if (req.user.role === "patient") filter.patient = req.user._id;
    const prescriptions = await Prescription.find(filter).populate(populateFields).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createPrescription = async (req, res) => {
  try {
    const doctor = req.user.role === "doctor" ? req.user._id : req.body.doctor;
    const prescription = await Prescription.create({ ...req.body, doctor });

    if (req.body.appointment) {
      await Appointment.findByIdAndUpdate(req.body.appointment, { status: "Completed" });
    }

    await Notification.create({
      user: req.body.patient,
      title: "Prescription added",
      message: "Doctor has added your prescription.",
      type: "success"
    });

    res.status(201).json({ message: "Prescription created", prescription: await prescription.populate(populateFields) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(populateFields);
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });
    res.json({ message: "Prescription updated", prescription });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });
    res.json({ message: "Prescription deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
