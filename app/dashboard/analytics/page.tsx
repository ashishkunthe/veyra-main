"use client";
import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Activity,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
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
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [invoiceStats, setInvoiceStats] = useState<any>({});

  useEffect(() => {
    // 🧪 Dummy analytics data
    setRevenueData([
      { month: "Jan", revenue: 1200 },
      { month: "Feb", revenue: 2200 },
      { month: "Mar", revenue: 1800 },
      { month: "Apr", revenue: 2600 },
      { month: "May", revenue: 3100 },
      { month: "Jun", revenue: 4000 },
    ]);

    setInvoiceStats({
      total: 1257,
      paid: 115300,
      pending: 24800,
      overdue: 8950,
    });
  }, []);

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
              {invoiceStats.total?.toLocaleString()}
            </p>
          </div>
          <FileText className="text-indigo-400 mt-4" />
        </div>

        {/* Paid */}
        <div className="p-6 bg-[#141124] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm text-gray-400">Paid</h2>
            <p className="text-3xl font-bold mt-2 text-green-400">
              {invoiceStats.paid?.toLocaleString()}
            </p>
          </div>
          <CheckCircle className="text-green-400 mt-4" />
        </div>

        {/* Pending */}
        <div className="p-6 bg-[#141124] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm text-gray-400">Pending</h2>
            <p className="text-3xl font-bold mt-2 text-yellow-400">
              {invoiceStats.pending?.toLocaleString()}
            </p>
          </div>
          <Clock className="text-yellow-400 mt-4" />
        </div>

        {/* Overdue */}
        <div className="p-6 bg-[#141124] border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm text-gray-400">Overdue</h2>
            <p className="text-3xl font-bold mt-2 text-red-400">
              {invoiceStats.overdue?.toLocaleString()}
            </p>
          </div>
          <AlertCircle className="text-red-400 mt-4" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-[#141124] border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold mb-4 text-indigo-300">
            Monthly Revenue
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
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
                  { name: "Paid", value: invoiceStats.paid },
                  { name: "Pending", value: invoiceStats.pending },
                  { name: "Overdue", value: invoiceStats.overdue },
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
