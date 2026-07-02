const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const Notification = require("../models/Notification");

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Appointment.deleteMany();
    await Prescription.deleteMany();
    await Notification.deleteMany();

    const password = await bcrypt.hash("123456", 10);

    const admin = await User.create({ name: "Admin User", email: "admin@hms.com", password, role: "admin", phone: "9876543210" });
    const doctor1 = await User.create({ name: "Dr. Arjun Kumar", email: "doctor@hms.com", password, role: "doctor", specialization: "Cardiologist", department: "Cardiology", experience: 8, phone: "9876500001" });
    const doctor2 = await User.create({ name: "Dr. Priya Sharma", email: "priya@hms.com", password, role: "doctor", specialization: "Dermatologist", department: "Skin Care", experience: 5, phone: "9876500002" });
    const patient1 = await User.create({ name: "Rahul Raj", email: "patient@hms.com", password, role: "patient", age: 24, gender: "Male", bloodGroup: "O+", phone: "9876500003", emergencyContact: "9876500004" });
    const patient2 = await User.create({ name: "Meena Devi", email: "meena@hms.com", password, role: "patient", age: 31, gender: "Female", bloodGroup: "A+", phone: "9876500005" });

    const appt = await Appointment.create({
      patient: patient1._id,
      doctor: doctor1._id,
      date: "2026-07-05",
      time: "10:30 AM",
      reason: "Chest pain consultation",
      department: "Cardiology",
      status: "Approved"
    });

    await Prescription.create({
      appointment: appt._id,
      patient: patient1._id,
      doctor: doctor1._id,
      symptoms: "Mild chest pain",
      diagnosis: "Acidity related discomfort",
      medicines: [{ name: "Pantoprazole", dosage: "40mg", duration: "5 days", instructions: "Before food" }],
      advice: "Avoid spicy food and take rest",
      followUpDate: "2026-07-12"
    });

    await Notification.create([
      { user: admin._id, title: "Welcome Admin", message: "Dashboard is ready.", type: "success" },
      { user: doctor1._id, title: "New Appointment", message: "Rahul Raj booked an appointment.", type: "info" },
      { user: patient1._id, title: "Appointment Approved", message: "Your appointment is approved.", type: "success" }
    ]);

    console.log("Seed completed");
    console.log("Login accounts:");
    console.log("Admin: admin@hms.com / 123456");
    console.log("Doctor: doctor@hms.com / 123456");
    console.log("Patient: patient@hms.com / 123456");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
