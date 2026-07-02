const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

const populateFields = [
  { path: "patient", select: "name email phone age gender bloodGroup" },
  { path: "doctor", select: "name email specialization department" }
];

exports.getAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "doctor") filter.doctor = req.user._id;
    if (req.user.role === "patient") filter.patient = req.user._id;
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter).populate(populateFields).sort({ date: -1, time: -1 });
    res.json(appointments);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createAppointment = async (req, res) => {
  try {
    const patient = req.user.role === "patient" ? req.user._id : req.body.patient;
    const appointment = await Appointment.create({ ...req.body, patient });

    await Notification.create({
      user: req.body.doctor,
      title: "New appointment",
      message: "A new appointment has been booked.",
      type: "info"
    });

    res.status(201).json({ message: "Appointment booked", appointment: await appointment.populate(populateFields) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(populateFields);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    await Notification.create({
      user: appointment.patient._id,
      title: "Appointment updated",
      message: `Your appointment status is ${appointment.status}.`,
      type: appointment.status === "Approved" ? "success" : appointment.status === "Cancelled" ? "danger" : "info"
    });

    res.json({ message: "Appointment updated", appointment });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
