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

      const token = signinToken(user._id);
    
      res.redirect(`${process.env.FRONTEND_BASE_URL}/home?token=${encodeURIComponent(token)}`);
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

exports.signUp = async (req, res) => {
  try {
    console.log(req.body)
    const newUser = await User.create(req.body);
    const token = signinToken(newUser._id);
    res.status(201).json({ status: 'success', token });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field} already registered.`,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({ message: "Something went wrong!! Please try again" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        status: "failed",
        message: "email and password are required",
      });
    }

    const  user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        error: "incorrect credentials",
      });
    }

    const token = signinToken(user._id);
    res.status(201).json({ status: 'success', token });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: "Something went wrong Please try again",
    });
  }
};
