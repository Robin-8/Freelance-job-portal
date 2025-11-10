const express =require('express')
const {register, login, addJob, deleteJob, getAllJobs, updateJob, proposalReceived, proposalStatus} =require('../controllers/clientController')
const { authClient } = require('../middileware/clientMiddileware')
const router = express.Router()


router.post('/register',register)
router.post('/login',login)
router.post('/addJob',authClient,addJob)
router.put("/update/:id", updateJob);
router.put("/delete/:id", deleteJob); 
router.get("/all", getAllJobs);
router.get('/preposal',authClient,proposalReceived)
router.patch('/updateStatus/:preposalId',proposalStatus)

module.exports=router