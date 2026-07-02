const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const Notification = require("../models/Notification");

exports.getDashboard = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: "Completed" });
    const pendingAppointments = await Appointment.countDocuments({ status: "Pending" });
    const totalPrescriptions = await Prescription.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ user: req.user._id, isRead: false });
    const recentAppointments = await Appointment.find()
      .populate("patient", "name")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalPrescriptions,
      unreadNotifications,
      recentAppointments
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
