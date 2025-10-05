"use client";

import { Rocket } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen text-white">
      <h1 className="flex items-center gap-2 text-2xl md:text-4xl font-bold mb-6">
        Welcome to Veyra Dashboard
        <Rocket className="w-7 h-7 text-purple-400" />
      </h1>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-105 transition">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">
            Total Revenue
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-purple-300">
            $45,231.89
          </p>
          <p className="text-sm text-green-400 mt-1">+20.1% from last month</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-105 transition">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">
            Subscriptions
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-indigo-300">
            2,345
          </p>
          <p className="text-sm text-green-400 mt-1">+120 this month</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:scale-105 transition">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">
            Open Invoices
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-yellow-300">12</p>
          <p className="text-sm text-orange-400 mt-1">3 overdue</p>
        </div>
      </div>
    </div>
  );
}
