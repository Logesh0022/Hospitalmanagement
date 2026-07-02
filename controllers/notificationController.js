const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const filter = req.user.role === "admin" && req.query.all === "true" ? {} : { user: req.user._id };
    const notifications = await Notification.find(filter).populate("user", "name role").sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ message: "Notification created", notification });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ message: "Marked as read", notification });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
