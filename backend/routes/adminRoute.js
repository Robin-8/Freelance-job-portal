const express =require('express')
const { register, login, deleteUsers, getUsers, blockUsers, adminGetJobs, getAllProposalsAdmin, editJobs, updateJob, deleteJob, getAllAdmins } = require('../controllers/adminController')
const { authAdmin } = require('../middileware/adminMIddileware')
const router =express.Router()


router.post('/adminRegister',register)
router.post('/adminLogin',login)
router.get('/getUsers',authAdmin,getUsers)
router.delete('/deleteUser',authAdmin,deleteUsers)
router.put('/blockUser/:id',authAdmin,blockUsers)
router.get("/getJobs",authAdmin,adminGetJobs)
router.get('/getPreposal',authAdmin,getAllProposalsAdmin)
router.get('/editJobs/:id',authAdmin,editJobs)
router.put("/updateJob/:id", authAdmin, updateJob);
router.delete('/deleteJob/:id', authAdmin, deleteJob);
router.get("/getAllAdmins", getAllAdmins);




module.exports=router
