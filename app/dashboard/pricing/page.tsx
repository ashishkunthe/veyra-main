"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";

const PLAN_IDS = {
  starter: "plan_RQWtzIDOuFsegM",
  pro: "plan_RQWuo7mIXF9QzV",
};

interface PlanStatus {
  planName: string;
}

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<PlanStatus | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<
    "starter" | "pro" | "free" | null
  >(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${backendUrl}/razorpay/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentPlan(res.data);
    };
    fetchStatus();
  }, [backendUrl]);

  const handleSubscribe = async (planType: "starter" | "pro") => {
    try {
      setLoadingPlan(planType);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/login";
        return;
      }
      const res = await axios.post(
        `${backendUrl}/razorpay/create-subscription`,
        { planId: PLAN_IDS[planType] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const subscription = res.data.subscription;
      window.location.href = subscription.short_url;
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Subscription failed");
      } else {
        alert("Subscription failed");
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    // <ProtectedRoute>
    <div className="min-h-screen bg-[#fafafa] text-gray-900 flex flex-col items-center py-16 px-4">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-2 text-amber-600">
        📦 Choose Your Plan
      </h1>

      {/* Current Plan */}
      <p className="text-gray-600 mb-12">
        Your Current Plan:{" "}
        <span className="text-amber-600 font-semibold">
          {currentPlan ? currentPlan.planName : "Free Plan"}
        </span>
      </p>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        {/* Starter Plan */}
        <div className="bg-white border border-amber-300/30 p-10 rounded-2xl text-center shadow-lg hover:shadow-amber-300/50 transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-2 text-gray-900">Starter</h3>
          <p className="text-5xl font-bold mb-2 text-amber-600">₹299</p>
          <p className="text-gray-500 mb-6">/month</p>

          <ul className="text-left inline-block space-y-3 mb-8 text-gray-800">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> 50 invoices/month
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> Payment links
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> Real-time tracking
            </li>
          </ul>

          <button
            onClick={() => handleSubscribe("starter")}
            disabled={loadingPlan === "starter"}
            className={`w-full rounded-full py-3 font-semibold transition ${
              loadingPlan === "starter"
                ? "bg-amber-200 cursor-not-allowed"
                : "bg-amber-300 hover:bg-amber-500 text-white"
            }`}
          >
            {loadingPlan === "starter" ? "Redirecting..." : "Get Starter"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white border border-amber-300/30 p-10 rounded-2xl text-center shadow-lg hover:shadow-amber-300/50 transition-all duration-300">
          <h3 className="text-2xl font-semibold mb-2 text-gray-900">Pro</h3>
          <p className="text-5xl font-bold mb-2 text-amber-600">₹749</p>
          <p className="text-gray-500 mb-6">/month</p>

          <ul className="text-left inline-block space-y-3 mb-8 text-gray-800">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> 100 invoices/month
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> Priority Support
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> Future Pro Tools
            </li>
          </ul>

          <button
            onClick={() => handleSubscribe("pro")}
            disabled={loadingPlan === "pro"}
            className={`w-full rounded-full py-3 font-semibold transition ${
              loadingPlan === "pro"
                ? "bg-amber-300 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            {loadingPlan === "pro" ? "Redirecting..." : "Go Pro"}
          </button>
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
