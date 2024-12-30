const Interview = require("../models/interview.model");
const axios = require("axios");
const FormData = require("form-data");
const { default: mongoose } = require("mongoose");

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

    const newDoc = await Interview.create({
      interviewee: userId,
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
      interviewId: newDoc?._id,
      message: response.data.choices[0].message.content,
    });
  } catch (error) {
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

    const formData = new FormData();
    formData.append("file", fileBuffer, {
      filename: originalName,
      contentType: mimeType,
    });
    formData.append("model", "whisper-1");

    const userPrompt = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    let conversationHistory = await Interview.findOne({
      _id: interviewId,
      interviewee: userId,
    });

    conversationHistory = [
      ...conversationHistory?.conversation,
      { role: "user", content: userPrompt?.data?.text },
    ];

    const data = {
      model: "gpt-4o-mini",
      messages: conversationHistory,
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
    const newInterview = await Interview.findOneAndUpdate(
      { interviewee: userId, _id: interviewId },
      {
        conversation: [
          ...conversationHistory,
          {
            role: "system",
            content: response.data.choices[0].message.content,
          },
        ],
      },
      { new: true, upsert: true }
    );
    let conversation = newInterview?.conversation;
    conversation?.shift();
    res.status(200).json({ message: conversation });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
