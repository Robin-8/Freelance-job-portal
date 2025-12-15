import express from "express";
import {
  register,
  login,
  getJobs,
  applyJobs,
  getAllPreposals,
  updateProfile,
  withdrawProposal,
  getJobById,
  getProfile,
  getPreposalCount,
} from "../controllers/freeLanceController.js";
import { authFreelancer } from "../middileware/freeLanceMiddilware.js";
import upload from "../multer/multer.js";
const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.get("/allJobs", getJobs);
router.get("/job/:id", authFreelancer, getJobById);
router.post("/applyJob/:id", authFreelancer, applyJobs);
router.get("/getPreposal", authFreelancer, getAllPreposals);
router.put("/updateProfile", authFreelancer, updateProfile);
router.delete("/withdraw/:proposalId", authFreelancer, withdrawProposal);
router.get("/getProfile", authFreelancer, getProfile);
router.get("/preposalCount", authFreelancer, getPreposalCount);

export default router;
