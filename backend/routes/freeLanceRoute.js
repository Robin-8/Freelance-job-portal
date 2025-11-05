const express=require('express')
const { register, login, getJobs } = require('../controllers/freeLanceController')
const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/allJobs',getJobs)

module.exports=router