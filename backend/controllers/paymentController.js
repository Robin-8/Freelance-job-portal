const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../model/paymentModel");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR",userId, metadata = {} } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: metadata,
      
    };

    const order = await instance.orders.create(options);

    await Payment.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
      metadata,
      userId:userId
    });

    res.json(order);
  } catch (err) {
    console.error("createOrder error", err);
    res.status(500).json({ error: "Unable to create order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest === razorpay_signature) {
      
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentId: razorpay_payment_id, status: "paid" },
        { new: true }
      );

      return res.json({ success: true });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  } catch (err) {
    console.error("verifyPayment error", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

module.exports = { createOrder,verifyPayment };
