const { default: axios } = require("axios");
const CVDetails = require("../models/cvDetails.model");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket("moth-cv");

exports.getCVDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const details = await CVDetails.find({ owner: userId });
    res.status(200).json({ status: "success", details: details[0] });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
};

exports.addPsersonalDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.file) {
      const blob = bucket.file(userId);
      const blodStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blodStream.on("error", (error) => {
        return res.send({ message: error.message });
      });

      blodStream.end(req.file.buffer);

      req.body = {
        ...req.body,
        profilePhoto: `https://storage.googleapis.com/moth-cv/${userId}`,
      };
    }

    await CVDetails.findOneAndUpdate(
      {
        owner: userId,
      },
      {
        personalDetails: req.body,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getPersonalDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const personalDetails = await CVDetails.findOne({ owner: userId }).select(
      "personalDetails"
    );
    res.status(200).json({ status: "success", personalDetails });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.addWorkExperience = async (req, res) => {
  try {
    const { userId } = req.params;
    await CVDetails.findOneAndUpdate(
      {
        owner: userId,
      },
      {
        $push: { workExperience: req.body },
      },
      { upsert: true, new: true }
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getJobDescription = async (req, res) => {
  try {
    const { jobTitle } = req.body;
    const prompt = `List 5 brilliant roles and responsibilities or job descriptions for ${jobTitle} in bullet point format without adding introductory phrases or additional formatting.`;
    const data = {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    };

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    res.status(200).json({
      status: "success",
      description: response.data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getWorkExperience = async (req, res) => {
  try {
    const { userId } = req.params;
    const workExperience = await CVDetails.findOne({ owner: userId }).select(
      "workExperience"
    );
    res.status(200).json({ status: "success", workExperience });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.deleteWorkExperience = async (req, res) => {
  try {
    const { userId, jobTitle, company, startDate } = req.params;
    const deletedDocument = await CVDetails.findOneAndUpdate(
      {
        owner: userId,
        "workExperience.jobTitle": jobTitle,
        "workExperience.company": company,
        "workExperience.startDate": startDate,
      },
      {
        $pull: {
          workExperience: {
            jobTitle: jobTitle,
            company: company,
            startDate: startDate,
          },
        },
      },
      { new: true }
    );
    if (!deletedDocument) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.addEducation = async (req, res) => {
  try {
    const { userId } = req.params;
    await CVDetails.findOneAndUpdate(
      {
        owner: userId,
      },
      {
        $push: { education: req.body },
      },
      { upsert: true, new: true }
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getEducation = async (req, res) => {
  try {
    const { userId } = req.params;
    const education = await CVDetails.findOne({ owner: userId }).select(
      "education"
    );
    res.status(200).json({ status: "success", education });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const { userId, degree, school, startDate } = req.params;
    const deletedDocument = await CVDetails.findOneAndUpdate(
      {
        owner: userId,
        "education.school": school,
        "education.degree": degree,
        "education.startDate": startDate,
      },
      {
        $pull: {
          education: {
            school: school,
            degree: degree,
            startDate: startDate,
          },
        },
      },
      { new: true }
    );
    if (!deletedDocument) {
      return res.status(404).json({ message: "Education not found" });
    }
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { userId } = req.params;
    await CVDetails.findOneAndUpdate(
      {
        owner: userId,
      },
      {
        $push: { skills: req.body.skill },
      },
      { upsert: true, new: true }
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await CVDetails.findOne({ owner: userId }).select("skills");
    res.status(200).json({ status: "success", skills });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { skill, userId } = req.params;
    const deletedDocument = await CVDetails.findOneAndUpdate(
      { owner: userId },
      {
        $pull: {
          skills: skill,
        },
      },
      { new: true }
    );
    if (!deletedDocument) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.addProfessionalSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    await CVDetails.findOneAndUpdate(
      { owner: userId },
      { professionalSummary: req.body.professionalSummary }
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getProfessionalSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const professionalSummary = await CVDetails.findOne({
      owner: userId,
    }).select("professionalSummary");
    res.status(200).json({ status: "success", professionalSummary });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.generateProfessionalSummary = async (req, res) => {
  try {
    const { jobTitle } = req.body;
    const prompt = `Generate a brilliant, creative, and professional professional summary for a resume for a ${jobTitle} role about 60 words. Highlight expertise in customer service, sales, product knowledge, and relationship building. Emphasize a proven track record of achieving sales targets, excellent communication skills, and a strong ability to assist customers in selecting products that meet their needs. Showcase an enthusiastic and results-driven attitude with a passion for exceeding expectations and contributing to team success`;
    const data = {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    };

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    res.status(200).json({
      status: "success",
      professionalSummary: response.data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
};

exports.addReference = async (req, res) => {
  try {
    const { userId } = req.params;
    await CVDetails.findOneAndUpdate(
      {
        owner: userId,
      },
      {
        $push: { references: req.body },
      },
      { upsert: true, new: true }
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.getReferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const references = await CVDetails.findOne({ owner: userId }).select(
      "references"
    );
    res.status(200).json({ status: "success", references });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.deleteReference = async (req, res) => {
  try {
    const { userId, name, company, phone } = req.params;
    const deletedDocument = await CVDetails.findOneAndUpdate(
      {
        owner: userId,
        "references.name": name,
        "references.company": company,
        "references.phone": phone,
      },
      {
        $pull: {
          references: {
            name: name,
            company: company,
            phone: phone,
          },
        },
      },
      { new: true }
    );
    if (!deletedDocument) {
      return res.status(404).json({ message: "Reference not found" });
    }
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
