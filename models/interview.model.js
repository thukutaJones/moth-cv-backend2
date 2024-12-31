const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema(
  {
    interviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    conversation: [
      {
        role: {
          type: String,
        },
        content: {
          type: String,
        },
      },
    ],
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Interview", InterviewSchema);
