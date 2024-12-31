const express = require("express");
const { submitInquiry } = require("../controllers/inquiry.controller");

const router = express.Router();

router.post("/submit", submitInquiry);

module.exports = router;
