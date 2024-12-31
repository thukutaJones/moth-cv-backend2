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

const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get("/:userId", getCVDetails);
router.post(
  "/personal-details/:userId",
  multer.single("image"),
  addPsersonalDetails
);
router.get("/personal-details/:userId", getPersonalDetails);
router.post("/work-experience/:userId", addWorkExperience);
router.post("/work-experience/get/description", getJobDescription);
router.get("/work-experience/:userId", getWorkExperience);
router.delete(
  "/work-experience/:userId/:jobTitle/:company/:startDate",
  deleteWorkExperience
);
router.post("/education/:userId", addEducation);
router.get("/education/:userId", getEducation);
router.delete("/education/:userId/:degree/:school/:startDate", deleteEducation);
router.post("/skills/:userId", addSkill);
router.get("/skills/:userId", getSkills);
router.delete("/skills/:userId/:skill", deleteSkill);
router.post("/professional-summary/:userId", addProfessionalSummary);
router.get("/professional-summary/:userId", getProfessionalSummary);
router.post(
  "/professional-summary/get/professional-summary",
  generateProfessionalSummary
);
router.post("/references/:userId", addReference);
router.get("/references/:userId", getReferences);
router.delete("/references/:userId/:name/:company/:phone", deleteReference);

module.exports = router;
