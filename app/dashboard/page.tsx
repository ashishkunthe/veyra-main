"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import OnboardingModal from "@/components/OnboardingModal";
import { Rocket } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalInvoices: 0,
    openInvoices: 0,
    totalClients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch dashboard stats
        const [statsRes, profileRes] = await Promise.all([
          axios.get(`${backendUrl}/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(statsRes.data);

        // Check if onboarding is complete
        if (!profileRes.data.onboardingComplete) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading dashboard...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-white text-gray-900 px-6 animate-fadeIn">
        {/* 🚀 Header */}
        <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold mb-8">
          Welcome to Veyra Dashboard
          <Rocket className="w-7 h-7 text-amber-500" />
        </h1>

        {/* 📊 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-amber-400/20 hover:border-amber-400 transition">
            <h2 className="text-sm font-semibold mb-2 text-gray-500">
              Total Revenue
            </h2>
            <p className="text-3xl font-bold text-amber-600">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-amber-400/20 hover:border-amber-400 transition">
            <h2 className="text-sm font-semibold mb-2 text-gray-500">
              Total Clients
            </h2>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalClients}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-amber-400/20 hover:border-amber-400 transition">
            <h2 className="text-sm font-semibold mb-2 text-gray-500">
              Open Invoices
            </h2>
            <p className="text-3xl font-bold text-amber-500">
              {stats.openInvoices}
            </p>
          </div>
        </div>

        {/* 🧭 Onboarding Modal */}
        {showOnboarding && (
          <OnboardingModal onComplete={() => setShowOnboarding(false)} />
        )}
      </div>
    </ProtectedRoute>
  );
}
