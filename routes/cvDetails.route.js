const express = require("express");
const Multer = require("multer");

const {
  addPsersonalDetails,
  getPersonalDetails,
  addWorkExperience,
  getJobDescription,
  getWorkExperience,
  deleteWorkExperience,
  addEducation,
  getEducation,
  deleteEducation,
  addSkill,
  getSkills,
  deleteSkill,
  addProfessionalSummary,
  getProfessionalSummary,
  generateProfessionalSummary,
  addReference,
  getReferences,
  deleteReference,
  getCVDetails,
} = require("../controllers/cvdetails.controller");
const authenticateToken = require("../config/authenticate");

const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get("/:userId", authenticateToken, getCVDetails);
router.post(
  "/personal-details/:userId",
  multer.single("image"),
  addPsersonalDetails
);
router.get("/personal-details/:userId", authenticateToken, getPersonalDetails);
router.post("/work-experience/:userId", addWorkExperience);
router.post("/work-experience/get/description", getJobDescription);
router.get("/work-experience/:userId", getWorkExperience);
router.delete(
  "/work-experience/:userId/:jobTitle/:company/:startDate",
  deleteWorkExperience
);
router.post("/education/:userId", authenticateToken, addEducation);
router.get("/education/:userId", getEducation);
router.delete(
  "/education/:userId/:degree/:school/:startDate",
  authenticateToken,
  deleteEducation
);
router.post("/skills/:userId", authenticateToken, addSkill);
router.get("/skills/:userId", authenticateToken, getSkills);
router.delete("/skills/:userId/:skill", authenticateToken, deleteSkill);
router.post(
  "/professional-summary/:userId",
  authenticateToken,
  addProfessionalSummary
);
router.get(
  "/professional-summary/:userId",
  authenticateToken,
  getProfessionalSummary
);
router.post(
  "/professional-summary/get/professional-summary",
  authenticateToken,
  generateProfessionalSummary
);
router.post("/references/:userId", authenticateToken, addReference);
router.get("/references/:userId", authenticateToken, getReferences);
router.delete(
  "/references/:userId/:name/:company/:phone",
  authenticateToken,
  deleteReference
);

module.exports = router;
