const express = require("express");
const {
  getUserData,
  deleteAccount,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/:userId", getUserData);
router.delete("/:userId", deleteAccount);

module.exports = router;
