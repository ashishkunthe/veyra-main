"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";

const PLAN_IDS = {
  starter: "plan_RQWtzIDOuFsegM",
  pro: "plan_RQWuo7mIXF9QzV",
};

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState<"starter" | "pro" | null>(
    null
  );

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:4000/razorpay/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentPlan(res.data);
    };
    fetchStatus();
  }, []);

  const handleSubscribe = async (planType: "starter" | "pro") => {
    try {
      setLoadingPlan(planType);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/login";
        return;
      }
      const res = await axios.post(
        "http://localhost:4000/razorpay/create-subscription",
        { planId: PLAN_IDS[planType] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const subscription = res.data.subscription;
      window.location.href = subscription.short_url;
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Subscription failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center py-16 px-4">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
        📦 Choose Your Plan
      </h1>

      {/* Current Plan */}
      <p className="text-gray-400 mb-12">
        Your Current Plan:{" "}
        <span className="text-indigo-400 font-semibold">
          {currentPlan ? currentPlan.planName : "Free Plan"}
        </span>
      </p>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        {/* Starter Plan */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center shadow-lg hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-2">Starter</h3>
          <p className="text-5xl font-bold mb-2">₹299</p>
          <p className="text-gray-400 mb-6">/month</p>

          <ul className="text-left inline-block space-y-3 mb-8">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" /> 1000 invoices/month
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" /> Payment links
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" /> Real-time tracking
            </li>
          </ul>

          <button
            onClick={() => handleSubscribe("starter")}
            disabled={loadingPlan === "starter"}
            className={`w-full rounded-full py-3 font-semibold transition ${
              loadingPlan === "starter"
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loadingPlan === "starter" ? "Redirecting..." : "Get Starter"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center shadow-lg hover:scale-105 transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-2">Pro</h3>
          <p className="text-5xl font-bold mb-2">₹749</p>
          <p className="text-gray-400 mb-6">/month</p>

          <ul className="text-left inline-block space-y-3 mb-8">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" /> Unlimited invoices
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" /> Priority Support
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" /> Future Pro Tools
            </li>
          </ul>

          <button
            onClick={() => handleSubscribe("pro")}
            disabled={loadingPlan === "pro"}
            className={`w-full rounded-full py-3 font-semibold transition ${
              loadingPlan === "pro"
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loadingPlan === "pro" ? "Redirecting..." : "Go Pro"}
          </button>
        </div>
      </div>
    </div>
  );
}
