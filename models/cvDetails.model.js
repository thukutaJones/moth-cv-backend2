const mongoose = require("mongoose");

const CVDetailsSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    personalDetails: {
      fullName: {
        type: String,
      },
      email: {
        type: String,
      },
      address: {
        type: String,
      },
      nationality: {
        type: String,
      },
      phone: {
        type: String,
      },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
    workExperience: [
      {
        jobTitle: {
          type: String,
        },
        company: {
          type: String,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        jobDescription: {
          type: String,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
        },
        degree: {
          type: String,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
      },
    ],
    skills: {
      type: [String],
    },
    professionalSummary: {
      type: String,
    },
    references: [
      {
        name: {
          type: String,
        },
        jobTitle: {
          type: String,
        },
        company: {
          type: String,
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        address: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.model("CvDetail", CVDetailsSchema);
