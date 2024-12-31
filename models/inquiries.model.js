const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  inquiry: {
    type: String,
  },
});

module.exports = mongoose.model("Inquiry", InquirySchema);
