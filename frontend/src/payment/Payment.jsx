import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosApi";

const Payment = () => {
  const user = useSelector((state) => state.client?.user);
  const location = useLocation();
  const { amount, jobId } = location.state || {};

  const startPayment = async () => {
    try {
      if (!user?._id || !amount) {
        alert("Missing user or amount info");
        return;
      }

      // 1. Create Order (Backend)
      const { data } = await axiosInstance.post("/payment/createOrder", {
        amount,
        jobId,
        userId: user._id, 
      });

      const order = data.order;

      // 2. Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Vite env variable
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Freelance Portal",
        description: "Freelancer Payment",
        handler: async function (response) {
          try {
            // 3. Verify Payment (Backend)
            await axiosInstance.post("/payment/verifyPayment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Payment Successful!");
          } catch (err) {
            console.error("Verification Error:", err);
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#111827" }, // dark theme
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment Init Error:", error);
      alert("Failed to create payment order");
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-[400px] text-center">
        <h2 className="text-2xl font-semibold mb-4">Payment</h2>
        <p className="text-lg mb-6">
          You are about to pay:
          <span className="font-bold text-green-400"> ₹{amount || 0}</span>
        </p>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg"
          onClick={startPayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;
