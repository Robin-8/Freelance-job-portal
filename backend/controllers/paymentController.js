import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "../model/paymentModel.js";
import instance from "../config/razorPayInstance.js";


export const createOrder = async (req, res) => {
  try {
    const { amount, jobId } = req.body;
    const userId = req.client._id;

    const order = await instance.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
    });

    await Payment.create({
      orderId: order.id,
      userId,
      jobId,
      amount,
      status: "created",
    });

    res.status(200).json({ order });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id, status: "paid" }
    );

    res.status(200).json({ message: "Payment verified" });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getClientTotalPayments = async (req, res) => {
  try {
    const clientId = req.client._id;

    const result = await Payment.aggregate([
      {
        $match: {
          userId: clientId,
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      total: result.length ? result[0].totalPaid : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClientPaymentSummary = async (req, res) => {
  try {
    const clientId = req.client._id;
    const year = new Date().getFullYear();

    const monthlyResult = await Payment.aggregate([
      {
        $match: {
          userId: clientId,
          status: "paid",
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          amount: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({ monthlyResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
