import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "../model/paymentModel.js";
import instance from "../config/razorPayInstance.js";


// 1. Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount, jobId } = req.body;
    const userId = req.client.id;

    const order = await instance.orders.create({
      amount: amount * 100, // paise
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
    res.status(500).json({ message: "Order creation failed" });
  }
};

// 2. Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

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
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Client Total Payment
export const getClientTotalPayments = async (req, res) => {
  try {
    const clientId = req.client.id;

    const result = await Payment.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(clientId),
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

    return res.status(200).json({
      total: result.length ? result[0].totalPaid : 0,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Failed to fetch total payments" });
  }
};

// 4. Client Payment Summary (Monthly + Total)
export const getClientPaymentSummary = async (req, res) => {
  try {
    const clientId = req.client.id;
    const year = new Date().getFullYear();

    const totalResult = await Payment.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(clientId),
          status: "paid",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const monthlyResult = await Payment.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(clientId),
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
      { $sort: { "_id.month": 1 } },
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];

    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: months[i],
      amount: 0,
    }));

    monthlyResult.forEach((m) => {
      monthly[m._id.month - 1].amount = m.amount;
    });

    return res.status(200).json({
      totalAmount: totalResult.length ? totalResult[0].total : 0,
      monthly,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching summary" });
  }
};
