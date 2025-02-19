const express = require("express");
const helmet = require("helmet");
const mongosanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const passport = require("./config/passport.auth");
const cookieParser = require("cookie-parser");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ["http://192.168.1.183:3000", "http://localhost:3000", "https://moth-cv.vercel.app"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(mongosanitize());
app.use(xss());
app.use(express.json());

const userRouter = require("./routes/user.routes");
const interviewRouter = require("./routes/interview.route");
const authRouter = require("./routes/auth.route");
const cvDetailsRouter = require("./routes/cvDetails.route");
const inQuiryRouter = require('./routes/inquiry.route')

app.use("/api/me", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/auth", authRouter);
app.use("/api/cv-details", cvDetailsRouter);
app.use("/api/inquiry", inQuiryRouter);

module.exports = app;
