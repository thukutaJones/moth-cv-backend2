const Interview = require("../models/interview.model");
const axios = require("axios");

exports.initiateInterview = async (req, res) => {
  try {
    const { prompt } = req.body;
    const { userId } = req.params;
    const data = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
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
    console.log(response.data.choices[0].message.content);

    const newDoc = await Interview.create({
      interviwee: userId,
      conversation: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content: response.data.choices[0].message.content,
        },
      ],
    });
    res.status(200).json({
      interviewId: newDoc,
      message: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

exports.proceedInterview = async (req, res) => {
  try {
    const { userId, interviewId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;

    console.log()

    const formData = new FormData();
    formData.append('file', fileBuffer, originalName);
    formData.append("model", "whisper-1");
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    const conversationHistory = await Interview.findOne({
      interviwee: userId,
      _id: interviewId,
    });

    const newInterview = await Interview.findOneAndUpdate(
      { interviwee: userId, _id: interviewId },
      {
        $push: {
          conversation: [
            ...conversationHistory,
            {
              role: "system",
              content: response.data.choices[0].message.content,
            },
          ],
        },
      },
      { new: true, upsert: true }
    );
    console.log(newInterview);
    let conversation = newInterview?.conversation;
    console.log(conversation);
    conversation?.shift();
    res.status(200).json({ message: conversation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
