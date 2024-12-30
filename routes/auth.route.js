const express = require("express");
const {
  googleSignIn,
  googleAuthCallback,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/google-signin", googleSignIn);
router.get("/google/callback", googleAuthCallback);

module.exports = router;
