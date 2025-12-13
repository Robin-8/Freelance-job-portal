import express from "express";
import {
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
} from "../controllers/clientController.js";

import { authClient } from "../middileware/clientMiddileware.js";

const router = express.Router(); // ✅ correct

router.post("/register", register);
router.post("/login", login);

router.post("/addJob", authClient, addJob);
router.put("/update/:id", authClient, updateJob);
router.delete("/delete/:id", authClient, deleteJob);

router.get("/all", getAllJobs);
router.get("/preposal", authClient, proposalReceived);
router.patch("/updateStatus/:preposalId", authClient, proposalStatus);

router.get("/editJobs/:id", authClient, editJobs);
router.put("/updateJob/:id", authClient, updateJob);

router.get("/job/:id/applicants-count", getApplicantsCount);
router.get("/total-freelancers", authClient, getClientTotalFreelancersApplied);
router.get("/jobs-posted", authClient, getClientJobsPosted);
router.get("/proposal-stats", authClient, getClientProposalStats);

export default router;
