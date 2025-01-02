const express = require("express");
const {
  getUserData,
  deleteAccount,
} = require("../controllers/user.controller");
const authenticateToken = require("../config/authenticate");

const router = express.Router();

router.get("/:userId",authenticateToken, authenticateToken, getUserData);
router.delete("/:userId",  authenticateToken, deleteAccount);

module.exports = router;