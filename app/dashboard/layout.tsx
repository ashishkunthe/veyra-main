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
  CreditCard,
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
    { href: "/dashboard/pricing", icon: CreditCard, label: "Pricing" },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Soft ambient gold glows */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-amber-300 opacity-20 blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-amber-400 opacity-20 blur-[180px] rounded-full -z-10"></div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 top-0 left-0 h-screen md:h-full w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 p-6 space-y-8 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Veyra" width={38} height={38} />
            <h1 className="text-xl font-bold">Veyra</h1>
          </div>
          <button
            className="md:hidden text-gray-700 hover:text-amber-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={26} />
          </button>
        </div>

        <nav className="space-y-2 mt-8">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                pathname === href
                  ? "bg-amber-100 border border-amber-300 text-amber-700 font-medium"
                  : "hover:bg-amber-50 text-gray-700 hover:text-amber-600"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Topbar */}
      <div className="flex-1 flex flex-col h-full">
        <header className="flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-700 hover:text-amber-600"
            >
              <Menu size={28} />
            </button>
            <h2 className="text-lg font-semibold">Welcome back 👋</h2>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10">{children}</main>
      </div>
    </div>
  );
}
