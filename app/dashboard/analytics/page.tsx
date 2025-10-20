"use client";
import { useEffect, useState } from "react";
import {
  BarChart3,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [statusSummary, setStatusSummary] = useState<any>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [overviewRes, statusRes, revenueRes] = await Promise.all([
          axios.get("http://localhost:4000/analytics/overview", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/analytics/status-summary", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/analytics/monthly-revenue", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOverview(overviewRes.data);
        setStatusSummary(statusRes.data);
        setMonthlyRevenue(revenueRes.data || []);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-20 text-lg">
        Fetching analytics data...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <BarChart3 className="text-indigo-400" /> Analytics Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Invoices */}
        <div className="p-6 bg-[#141124] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm text-gray-400">Total Invoices</h2>
            <p className="text-3xl font-bold mt-2">
              {overview?.totalInvoices || 0}
            </p>
          </div>
          <FileText className="text-indigo-400 mt-4" />
        </div>

        {/* Paid */}
        <div className="p-6 bg-[#141124] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm text-gray-400">Paid</h2>
            <p className="text-3xl font-bold mt-2 text-green-400">
              {statusSummary?.paid || 0}
            </p>
          </div>
          <CheckCircle className="text-green-400 mt-4" />
        </div>

        {/* Pending */}
        <div className="p-6 bg-[#141124] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm text-gray-400">Pending</h2>
            <p className="text-3xl font-bold mt-2 text-yellow-400">
              {statusSummary?.pending || 0}
            </p>
          </div>
          <Clock className="text-yellow-400 mt-4" />
        </div>

        {/* Overdue */}
        <div className="p-6 bg-[#141124] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm text-gray-400">Overdue</h2>
            <p className="text-3xl font-bold mt-2 text-red-400">
              {statusSummary?.overdue || 0}
            </p>
          </div>
          <AlertCircle className="text-red-400 mt-4" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-[#141124] border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 text-indigo-300 flex items-center gap-2">
            <TrendingUp size={16} /> Monthly Revenue
          </h2>
          <div className="w-full h-72">
            {monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="month" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 text-center mt-24">
                No revenue data yet 📉
              </div>
            )}
          </div>
        </div>

        {/* Invoice Status Breakdown */}
        <div className="bg-[#141124] border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 text-indigo-300">
            Invoice Status Breakdown
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Paid", value: statusSummary?.paid || 0 },
                  { name: "Pending", value: statusSummary?.pending || 0 },
                  { name: "Overdue", value: statusSummary?.overdue || 0 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
