const Inquiry = require("../models/inquiries.model");

exports.submitInquiry = async (req, res) => {
  try {
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
};
