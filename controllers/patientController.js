const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getPatients = async (req, res) => {
  try {
    const q = req.query.search || "";
    const patients = await User.find({
      role: "patient",
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } }
      ]
    }).select("-password").sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createPatient = async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const password = await bcrypt.hash(req.body.password || "patient123", 10);
    const patient = await User.create({ ...req.body, role: "patient", password });
    res.status(201).json({ message: "Patient created", patient: await User.findById(patient._id).select("-password") });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updatePatient = async (req, res) => {
  try {
    delete req.body.password;
    delete req.body.role;
    const patient = await User.findOneAndUpdate({ _id: req.params.id, role: "patient" }, req.body, { new: true }).select("-password");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient updated", patient });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await User.findOneAndDelete({ _id: req.params.id, role: "patient" });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
