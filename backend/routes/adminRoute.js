import express from 'express';
import { 
  register, 
  login, 
  deleteUsers, 
  getUsers, 
  blockUsers, 
  adminGetJobs, 
  getAllProposalsAdmin, 
  editJobs, 
  updateJob, 
  deleteJob, 
  getAllAdmins,
  getAdminTotalPayments, 
  getAdminTotalFreelancersApplied, 
  getAdminJobsPosted, 
  getAdminProposalStats, 
  getAdminMonthlyPayments, 
  AdminAddJob
} from '../controllers/adminController.js';
import { authAdmin } from '../middileware/adminMIddileware.js';

const router = express.Router(); // ✅ use const router = express.Router();

router.post('/adminRegister', register);
router.post('/login', login);
router.get('/getUsers', authAdmin, getUsers);
router.delete('/deleteUser/:userId', authAdmin, deleteUsers);
router.put('/blockUser/:id', authAdmin, blockUsers);
router.get('/getJobs', authAdmin, adminGetJobs);
router.post("/addJob", authAdmin, AdminAddJob);
router.get('/getPreposal', authAdmin, getAllProposalsAdmin);
router.get('/editJobs/:id', authAdmin, editJobs);
router.put('/updateJob/:id', authAdmin, updateJob);
router.delete('/deleteJob/:id', authAdmin, deleteJob);
router.get('/getAllAdmins', getAllAdmins);
router.get("/total-payments",authAdmin, getAdminTotalPayments);
router.get("/freelancers-applied",authAdmin, getAdminTotalFreelancersApplied);
router.get("/jobs-posted",authAdmin, getAdminJobsPosted);
router.get("/proposal-stats",authAdmin, getAdminProposalStats);
router.get("/monthly-payments",authAdmin, getAdminMonthlyPayments);

export default router; 
