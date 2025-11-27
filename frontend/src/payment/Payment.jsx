import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosApi";

const Payment = () => {
  const user = useSelector((state) => state.client?.user);
  const location = useLocation();
  const { amount, preposalId } = location.state || {};

  const startPayment = async () => {
    try {
      if (!user?._id || !amount) {
        alert("Missing user or amount info");
        return;
      }

      const { data } = await axiosInstance.post("/payment/createOrder", {
        amount,
        userId: user._id,
        preposalId
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "Freelance Portal",
        description: "Freelancer Payment",
        handler: async function (response) {
          await axiosInstance.post("/payment/verifyPayment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            preposalId
          });
          alert("Payment Successful!");
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: { color: "#3399cc" }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("create order err", error);
    }
  };

  return (
    <div className="p-10">
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded"
        onClick={startPayment}
      >
        Pay ₹{amount || 0} Now
      </button>
    </div>
  );
};

export default Payment;
