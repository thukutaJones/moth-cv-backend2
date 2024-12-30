const express = require("express");
const Multer = require('multer');

const { addPsersonalDetails, getPersonalDetails } = require("../controllers/cvdetails.controller");

const router = express.Router();

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

router.post("/personal-details/:userId", multer.single('image'), addPsersonalDetails);
router.get("/personal-details/:userId", getPersonalDetails);

module.exports = router;
