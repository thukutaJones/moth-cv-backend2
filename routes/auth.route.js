const express = require("express");
const {
  googleSignIn,
  googleAuthCallback,
  signIn,
  signUp
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/google-signin", googleSignIn);
router.get("/google/callback", googleAuthCallback);
router.post("/sign-in", signIn);
router.post("/sign-up", signUp);

module.exports = router;
