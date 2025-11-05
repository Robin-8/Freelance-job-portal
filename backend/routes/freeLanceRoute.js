const express=require('express')
const { register, login, getJobs, applyJobs } = require('../controllers/freeLanceController')
const { authFreelancer } = require('../middileware/freeLanceMiddilware')
const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/allJobs',getJobs)
router.post('/applyJob/:id',authFreelancer,applyJobs)

module.exports=router