import express  from "express";
import {
  createOrder,
  verifyPayment,
  getClientTotalPayments,
  getClientPaymentSummary,
}  from "../controllers/paymentController.js";
import { authClient }  from "../middileware/clientMiddileware.js";

const router = express.Router();

router.post("/createOrder", authClient, createOrder);
router.post("/verifyPayment", authClient, verifyPayment);

router.get("/client/total", authClient, getClientTotalPayments);
router.get("/client/summary", authClient, getClientPaymentSummary);


export default router;
