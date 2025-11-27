const express = require('express')
const { createOrder, verifyPayment } = require('../controllers/paymentController')
const { authClient } = require('../middileware/clientMiddileware')
const router = express.Router()

router.post('/createOrder', authClient,createOrder)
router.post('/verifyPayment',authClient,verifyPayment)

module.exports=router