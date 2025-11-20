const express =require('express')
const { register, login, deleteUsers, getUsers, blockUsers, getJobs } = require('../controllers/adminController')
const { authAdmin } = require('../middileware/adminMIddileware')
const router =express.Router()


router.post('/adminRegister',register)
router.post('/adminLogin',login)
router.get('/getUsers',authAdmin,getUsers)
router.delete('/deleteUser',authAdmin,deleteUsers)
router.put('/blockUser/:id',authAdmin,blockUsers)
router.get("/getJobs",authAdmin,getJobs)


module.exports=router