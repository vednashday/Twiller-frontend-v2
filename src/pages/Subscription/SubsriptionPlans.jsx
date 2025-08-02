import React, { useState, useEffect } from "react";
import { CheckCircle, Infinity, Send } from "lucide-react";
import "./SubscriptionPlans.css";
import { useUserAuth } from "../../context/UserAuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import '../pages.css';

const plans = [
  {
    name: "Free",
    price: "₹0",
    tweets: "1 Tweet/month",
    badge: "FREE",
    icon: <Send className="plan-icon" />,
    planKey: "free",
  },
  {
    name: "Bronze",
    price: "₹100",
    tweets: "3 Tweets/month",
    badge: "BRONZE",
    icon: <Send className="plan-icon" />,
    planKey: "bronze",
  },
  {
    name: "Silver",
    price: "₹300",
    tweets: "5 Tweets/month",
    badge: "SILVER",
    icon: <CheckCircle className="plan-icon" />,
    planKey: "silver",
  },
  {
    name: "Gold",
    price: "₹1000",
    tweets: "Unlimited Tweets",
    badge: "GOLD",
    icon: <Infinity className="plan-icon" />,
    planKey: "gold",
  },
];

const SubscriptionPlans = () => {
  const { user, mongoUser, setMongoUser } = useUserAuth();
  const [loadingPlan, setLoadingPlan] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(`https://twiller-v2.onrender.com/loggedinuser?email=${user.email}`);
        setMongoUser(res.data);
      } catch (err) {
        console.error("Failed to fetch mongo user:", err);
      }
    };
    fetchUserData();
  }, [user, setMongoUser]);

  if (!user || !mongoUser) return <p>Loading...</p>;

  const handleSubscribe = async (plan) => {
    const confirm = window.confirm(`Proceed to pay for the ${plan.toUpperCase()} plan?`);
    if (!confirm) return;

    setLoadingPlan(plan);
    try {
      const idToken = await user.getIdToken();

      const { data } = await axios.post(
        "https://twiller-v2.onrender.com/create-subscription",
        { plan },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Twiller",
        description: `${plan.toUpperCase()} Plan Subscription`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await axios.post("https://twiller-v2.onrender.com/payment-success", {
              email: user.email,
              plan,
              paymentId: response.razorpay_payment_id,
            });

            // ✅ Fetch updated mongo user
            const userRes = await axios.get(`https://twiller-v2.onrender.com/loggedinuser?email=${user.email}`);
            setMongoUser(userRes.data);

            toast.success(`Payment for ${plan.toUpperCase()} successful!`);
          } catch (error) {
            toast.error("Payment succeeded, but subscription update failed.");
            console.error(error);
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#1DA1F2",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment not allowed at this time.");
      console.error(err);
    } finally {
      setLoadingPlan("");
    }
  };

  return (
    <div className="plans-container">
      <h2 className="plans-title">Choose Your Plan</h2>
      <div className="plans-grid">
        {plans.map((plan) => {
          const isCurrentPlan = mongoUser?.subscription === plan.planKey;
          return (
            <div key={plan.name} className="plan-card">
              <div className="card-content">
                <div className="plan-header">
                  {plan.icon}
                  <h3>{plan.name}</h3>
                  <span className={`badge badge-${plan.planKey}`}>{plan.badge}</span>
                </div>
                <p className="plan-price">{plan.price}/month</p>
                <p className="plan-limit">{plan.tweets}</p>
                <button
                  className="subscribe-btn"
                  onClick={() => handleSubscribe(plan.planKey)}
                  disabled={isCurrentPlan || loadingPlan === plan.planKey}
                >
                  {isCurrentPlan
                    ? "Current Plan"
                    : loadingPlan === plan.planKey
                    ? "Processing..."
                    : "Subscribe"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
