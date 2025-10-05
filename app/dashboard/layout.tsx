"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  FileText,
  BarChart3,
  Users,
  Building2,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/invoices", icon: FileText, label: "Invoices" },
    { href: "/dashboard/clients", icon: Users, label: "Clients" },
    { href: "/dashboard/company", icon: Building2, label: "Company" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-indigo-950 to-black text-white relative overflow-hidden">
      {/* ✨ Glowing background */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-600 opacity-20 blur-[180px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700 opacity-20 blur-[200px] rounded-full -z-10"></div>

      {/* 📱 Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* 📚 Sidebar */}
      <aside
        className={`fixed md:relative z-50 top-0 left-0 h-screen md:h-full w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 p-6 space-y-8 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Veyra" width={40} height={40} />
            <h1 className="text-2xl font-bold">Veyra</h1>
          </div>
          <button
            className="md:hidden text-white hover:text-indigo-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={26} />
          </button>
        </div>

        <nav className="space-y-3 mt-8">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                pathname === href
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/40"
                  : "hover:bg-white/5 hover:text-indigo-300"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 📊 Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* 🔝 Topbar */}
        <header className="flex justify-between items-center bg-black/60 backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-white hover:text-indigo-400"
            >
              <Menu size={28} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold">
              Welcome back 👋
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition text-sm md:text-base"
          >
            <LogOut size={18} /> Logout
          </button>
        </header>

        {/* 📦 Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10">{children}</main>
      </div>
    </div>
  );
}
