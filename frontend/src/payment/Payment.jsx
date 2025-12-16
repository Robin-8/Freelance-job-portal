import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosApi";
import toast from "react-hot-toast";

const Payment = () => {
  const user = useSelector((state) => state.client?.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, jobId } = location.state || {};

  const startPayment = async () => {
    if (!user?._id || !amount) {
      toast.error("Missing user or payment amount");
      return;
    }

    try {
      /* ---------------- CREATE ORDER ---------------- */

      toast.loading("Creating payment order...", { id: "payment" });

      const { data } = await axiosInstance.post("/payment/createOrder", {
        amount,
        jobId,
        userId: user._id,
      });

      const order = data.order;

      /* ---------------- RAZORPAY OPTIONS ---------------- */

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Freelance Portal",
        description: "Freelancer Payment",

        handler: async (response) => {
          try {
            toast.loading("Verifying payment...", { id: "payment" });

            await axiosInstance.post("/payment/verifyPayment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful!", { id: "payment" });

            // Optional redirect after success
            setTimeout(() => {
              navigate("/client/home");
            }, 1500);
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Payment verification failed", { id: "payment" });
          }
        },

        prefill: {
          name: user.name,
          email: user.email,
        },

        theme: {
          color: "#111827",
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function () {
        toast.error("Payment failed or cancelled", { id: "payment" });
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Payment Init Error:", error);
      toast.error("Failed to create payment order", { id: "payment" });
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
          onClick={startPayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;
