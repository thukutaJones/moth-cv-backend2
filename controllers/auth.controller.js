const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user.model");
require("../config/passport.auth");

signinToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.googleSignIn = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/sign-in`);
    }

    const token = signinToken(user._id);
    res.cookie("moth-cv-token", token, {
      expires:
        new Date(Date.now() + process.env.JTW_EXPIRES_IN) *
        (24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.redirect(`${process.env.FRONTEND_BASE_URL}/home`);
  })(req, res, next);
};

exports.clearCookie = async (req, res) => {
  try {
    res.clearCookie("moth-cv-token", { httpOnly: true });
    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ error: error.message, status: "failed" });
  }
};
