const express = require("express");
const {
  createOrder,
  verifyPayment,
  getClientTotalPayments,
  getClientPaymentSummary,
} = require("../controllers/paymentController");
const { authClient } = require("../middileware/clientMiddileware");

const router = express.Router();

router.post("/createOrder", authClient, createOrder);
router.post("/verifyPayment", authClient, verifyPayment);

router.get("/client/total", authClient, getClientTotalPayments);
router.get("/client/summary", authClient, getClientPaymentSummary);

module.exports = router;
