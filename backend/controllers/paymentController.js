const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Payment = require("../model/paymentModel");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const { amount, jobId } = req.body;
    const userId = req.client.id;

    const order = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    await Payment.create({
      orderId: order.id,
      userId,
      jobId,
      amount,
      status: "created",
    });

    return res.status(200).json(order);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Order creation failed" });
  }
};

// 2. Verify Razorpay Payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id, status: "paid" }
    );

    return res.status(200).json({ message: "Payment verified successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Verification failed" });
  }
};

// 3. Client Total Payment (Fixed)
const getClientTotalPayments = async (req, res) => {
  try {
    const clientId = req.client.id;

    const result = await Payment.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(clientId),
          status: "paid",
        },
      },
      { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
    ]);

    return res.status(200).json({
      total: result.length > 0 ? result[0].totalPaid : 0,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch total payments" });
  }
};

// 4. Client Summary – Monthly + Total
const getClientPaymentSummary = async (req, res) => {
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
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const monthly = Array(12).fill(0).map((v, i) => ({
      month: months[i],
      amount: 0,
    }));

    monthlyResult.forEach((m) => {
      monthly[m._id.month - 1].amount = m.amount;
    });

    return res.status(200).json({
      totalAmount:
        totalResult.length > 0 ? totalResult[0].total : 0,
      monthly,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching summary" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getClientTotalPayments,
  getClientPaymentSummary,
};
