const express =require('express')
const { register, login } = require('../controllers/adminController')
const router =express.Router()


router.post('/adminRegister',register)
router.post('/adminLogin',login)


module.exports=router