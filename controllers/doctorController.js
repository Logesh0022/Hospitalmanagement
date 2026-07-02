const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getDoctors = async (req, res) => {
  try {
    const q = req.query.search || "";
    const doctors = await User.find({
      role: "doctor",
      $or: [
        { name: { $regex: q, $options: "i" } },
        { specialization: { $regex: q, $options: "i" } },
        { department: { $regex: q, $options: "i" } }
      ]
    }).select("-password").sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createDoctor = async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const password = await bcrypt.hash(req.body.password || "doctor123", 10);
    const doctor = await User.create({ ...req.body, role: "doctor", password });
    res.status(201).json({ message: "Doctor created", doctor: await User.findById(doctor._id).select("-password") });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateDoctor = async (req, res) => {
  try {
    delete req.body.password;
    delete req.body.role;
    const doctor = await User.findOneAndUpdate({ _id: req.params.id, role: "doctor" }, req.body, { new: true }).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor updated", doctor });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findOneAndDelete({ _id: req.params.id, role: "doctor" });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
