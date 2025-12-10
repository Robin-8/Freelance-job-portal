const express=require('express')
const { register, login, getJobs, applyJobs, getAllPreposals, updateProfile, withdrawProposal, getJobById, getProfile, getPreposalCount } = require('../controllers/freeLanceController')
const { authFreelancer } = require('../middileware/freeLanceMiddilware')
const upload =require('../multer/multer')
const router=express.Router()

router.post('/register',upload.single('profileImage'),register)
router.post('/login',login)
router.get('/allJobs',getJobs)
router.get('/job/:id',authFreelancer,getJobById)
router.post('/applyJob/:id',authFreelancer,applyJobs)
router.get('/getPreposal',authFreelancer,getAllPreposals)
router.put('/updateProfile',authFreelancer,updateProfile)
router.delete('/withdraw/:proposalId', authFreelancer,withdrawProposal)
router.get('/getProfile',authFreelancer,getProfile)
router.get('/preposalCount',authFreelancer,getPreposalCount)


module.exports=router