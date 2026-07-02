const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Notification = require("../models/Notification");

const createToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
const cleanUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  gender: user.gender,
  age: user.age,
  address: user.address,
  specialization: user.specialization,
  department: user.department,
  bloodGroup: user.bloodGroup,
  emergencyContact: user.emergencyContact,
  settings: user.settings
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "patient" } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, role, password: hashedPassword });

    await Notification.create({
      user: user._id,
      title: "Welcome to HMS",
      message: "Your account has been created successfully.",
      type: "success"
    });

    res.status(201).json({ token: createToken(user._id, user.role), user: cleanUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    res.json({ token: createToken(user._id, user.role), user: cleanUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.me = async (req, res) => {
  res.json({ user: cleanUser(req.user) });
};
