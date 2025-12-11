const express = require("express");
const {
  register,
  login,
  addJob,
  deleteJob,
  getAllJobs,
  updateJob,
  proposalReceived,
  proposalStatus,
  editJobs,
  getApplicantsCount,
  getClientTotalFreelancersApplied,
  getClientJobsPosted,
  getClientProposalStats,
} = require("../controllers/clientController");
const { authClient } = require("../middileware/clientMiddileware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/addJob", authClient, addJob);
router.put("/update/:id", updateJob);
router.put("/delete/:id", deleteJob);
router.get("/all", getAllJobs);
router.get("/preposal", authClient, proposalReceived);
router.patch("/updateStatus/:preposalId", proposalStatus);
router.get("/editJobs/:id", authClient, editJobs);
router.put("/updateJob/:id", authClient, updateJob);
router.get("/job/:id/applicants-count", getApplicantsCount);
router.get("/total-freelancers", authClient, getClientTotalFreelancersApplied);
router.get("/jobs-posted", authClient, getClientJobsPosted);
router.get("/proposal-stats", authClient, getClientProposalStats);

module.exports = router;
