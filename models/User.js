const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "doctor", "patient"], default: "patient" },
    phone: { type: String, default: "" },
    gender: { type: String, default: "" },
    age: { type: Number, default: null },
    address: { type: String, default: "" },
    avatar: { type: String, default: "" },
    specialization: { type: String, default: "" },
    department: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    qualification: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    settings: {
      darkMode: { type: Boolean, default: false },
      emailAlerts: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
