const express = require('express')
const { initiateInterview, proceedInterview } = require('../controllers/interview.controller')
const Multer = require('multer')

const router = express.Router()

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

router.post('/initiate/:userId', initiateInterview)
router.post('/proceed/:userId/:interviewId',  multer.single('audio'), proceedInterview)

module.exports = router;