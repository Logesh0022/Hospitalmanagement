const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getProfile = async (req, res) => res.json(req.user);

exports.updateProfile = async (req, res) => {
  try {
    const blocked = ["password", "role", "email"];
    blocked.forEach((key) => delete req.body[key]);
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings: { ...req.user.settings.toObject?.() || req.user.settings, ...req.body } } },
      { new: true }
    ).select("-password");
    res.json({ message: "Settings updated", settings: user.settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: "Old password is wrong" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
