import React, { useState, useEffect } from "react";
import { CheckCircle, Infinity, Send } from "lucide-react";
import "./SubscriptionPlans.css";
import { useUserAuth } from "../../context/UserAuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import '../pages.css';
import { useTranslation } from "react-i18next";

const SubscriptionPlans = () => {
  const { t } = useTranslation();
  const { user, mongoUser, setMongoUser } = useUserAuth();
  const [loadingPlan, setLoadingPlan] = useState("");

  const plans = [
    {
      name: t("plan_free_name"),
      price: "₹0",
      tweets: `1 ${t("tweets_per_month")}`,
      badge: t("plan_free_name").toUpperCase(),
      icon: <Send className="plan-icon" />,
      planKey: "free",
    },
    {
      name: t("plan_bronze_name"),
      price: "₹100",
      tweets: `3 ${t("tweets_per_month")}`,
      badge: t("plan_bronze_name").toUpperCase(),
      icon: <Send className="plan-icon" />,
      planKey: "bronze",
    },
    {
      name: t("plan_silver_name"),
      price: "₹300",
      tweets: `5 ${t("tweets_per_month")}`,
      badge: t("plan_silver_name").toUpperCase(),
      icon: <CheckCircle className="plan-icon" />,
      planKey: "silver",
    },
    {
      name: t("plan_gold_name"),
      price: "₹1000",
      tweets: t("unlimited_tweets"),
      badge: t("plan_gold_name").toUpperCase(),
      icon: <Infinity className="plan-icon" />,
      planKey: "gold",
    },
  ];

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

  if (!user || !mongoUser) return <p>{t("loading")}</p>;

  const handleSubscribe = async (plan) => {
    const confirm = window.confirm(t("proceed_to_pay_for_plan", { plan: plan.toUpperCase() }));
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
        name: t("twiller_app_name"),
        description: t("plan_subscription_description", { plan: plan.toUpperCase() }),
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await axios.post("https://twiller-v2.onrender.com/payment-success", {
              email: user.email,
              plan,
              paymentId: response.razorpay_payment_id,
            });

            const userRes = await axios.get(`https://twiller-v2.onrender.com/loggedinuser?email=${user.email}`);
            setMongoUser(userRes.data);

            toast.success(t("payment_for_plan_successful", { plan: plan.toUpperCase() }));
          } catch (error) {
            toast.error(t("payment_succeeded_but_update_failed"));
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
      toast.error(t(err.response?.data?.message || "payment_not_allowed"));
      console.error(err);
    } finally {
      setLoadingPlan("");
    }
  };

  return (
    <div className="plans-container">
      <h2 className="plans-title">{t("choose_your_plan")}</h2>
      <div className="plans-grid">
        {plans.map((plan) => {
          const isCurrentPlan = mongoUser?.subscription === plan.planKey;
          return (
            <div key={plan.planKey} className="plan-card">
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
                    ? t("current_plan")
                    : loadingPlan === plan.planKey
                    ? t("processing")
                    : t("subscribe")}
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
