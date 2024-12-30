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
    console.log(personalDetails);
    res.status(200).json({ status: "success", personalDetails });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
