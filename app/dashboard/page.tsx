"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Rocket } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalInvoices: 0,
    openInvoices: 0,
    totalClients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
      <div className="min-h-screen bg-white text-gray-900 px-6 animate-fadeIn">
        <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold mb-8">
          Welcome to Veyra Dashboard
          <Rocket className="w-7 h-7 text-amber-500" />
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Revenue */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-amber-400/20 hover:border-amber-400 transition">
            <h2 className="text-sm font-semibold mb-2 text-gray-500">
              Total Revenue
            </h2>
            <p className="text-3xl font-bold text-amber-600">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>

          {/* Total Clients */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-amber-400/20 hover:border-amber-400 transition">
            <h2 className="text-sm font-semibold mb-2 text-gray-500">
              Total Clients
            </h2>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalClients}
            </p>
          </div>

          {/* Open Invoices */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-amber-400/20 hover:border-amber-400 transition">
            <h2 className="text-sm font-semibold mb-2 text-gray-500">
              Open Invoices
            </h2>
            <p className="text-3xl font-bold text-amber-500">
              {stats.openInvoices}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
