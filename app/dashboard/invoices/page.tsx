"use client";
import { useEffect, useState } from "react";
import { PlusCircle, Eye, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Invoice {
  id: string;
  clientName: string;
  total: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendUrl}/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const deleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="text-center text-gray-500 text-lg mt-10">
          Loading invoices...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    // <ProtectedRoute>
    <div className="min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-amber-100 text-amber-700">
            <FileText className="animate-pulse-slow" />
          </span>
          Invoices
        </h1>

        <Link
          href="/dashboard/invoices/new"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
        >
          <PlusCircle size={18} /> New Invoice
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-md">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-gray-600 text-sm border-b border-gray-200 bg-amber-50/40">
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Due Date</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-gray-100 hover:bg-amber-50/40 transition"
                >
                  <td className="p-4 font-medium">{invoice.clientName}</td>
                  <td className="p-4">₹{invoice.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : invoice.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right flex items-center gap-3 justify-end">
                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="text-gray-600 hover:text-amber-600 transition"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
                      className="text-gray-600 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
