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
      console.log(err);
      return res.redirect(`${process.env.FRONTEND_BASE_URL}`);
    }

    console.log("user", user);
    try {
      const token = signinToken(user._id);
      const cookieOptions = {
        httpOnly: true,
        sameSite: "Lax",
        secure: true
      };
      if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
      }
      res.cookie("moth-cv-token", token, cookieOptions);
      console.log("Cookie Set:", token, cookieOptions);
    } catch (error) {
      console.log(error);
    }

    res.redirect(`${process.env.FRONTEND_BASE_URL}/home`);
  })(req, res, next);
};

exports.clearCookie = async (req, res) => {
  try {
    res.clearCookie("moth-cv-token", { httpOnly: true, sameSite: "Lax" });
    return res.status(200).json({
      status: "success",
      message: "Cookie cleared",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Failed to clear cookie",
    });
  }
};
