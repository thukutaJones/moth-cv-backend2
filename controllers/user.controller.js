const User = require("../models/user.model");

exports.getUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(404).json({ status: "failed", message: "User ot found" });
    }
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
