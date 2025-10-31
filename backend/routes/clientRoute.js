const express =require('express')
const {register, login, addJob} =require('../controllers/clientController')
const { authClient } = require('../middileware/clientMiddileware')
const router = express.Router()


router.post('/register',register)
router.post('/login',login)
router.post('/addJob',authClient,addJob)

module.exports=router