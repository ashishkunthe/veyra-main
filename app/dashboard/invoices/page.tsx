"use client";
import { useEffect, useState } from "react";
import { PlusCircle, Eye, Trash2, FileText } from "lucide-react";
import Link from "next/link";

interface Invoice {
  _id: string;
  clientName: string;
  total: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy data for now
    const mockData: Invoice[] = [
      {
        _id: "1",
        clientName: "Acme Corp",
        total: 1200,
        status: "Paid",
        dueDate: "2023-08-15",
      },
      {
        _id: "2",
        clientName: "Tech Solutions Inc.",
        total: 850,
        status: "Pending",
        dueDate: "2023-09-01",
      },
      {
        _id: "3",
        clientName: "Global Innovations Ltd.",
        total: 1500,
        status: "Overdue",
        dueDate: "2023-07-20",
      },
    ];

    setTimeout(() => {
      setInvoices(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter((inv) => inv._id !== id));
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 text-lg mt-10">
        Loading invoices...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-indigo-600/20 text-indigo-400">
            <FileText className="animate-pulse-slow" />
          </span>
          Invoices
        </h1>
        <Link
          href="/dashboard/invoices/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm font-medium"
        >
          <PlusCircle size={18} /> New Invoice
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#141124] border border-white/10 rounded-2xl">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-white/10">
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
                <td colSpan={5} className="text-center p-8 text-gray-400">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr
                  key={invoice._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4 text-gray-200">{invoice.clientName}</td>
                  <td className="p-4 text-gray-300">
                    ${invoice.total.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        invoice.status === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : invoice.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{invoice.dueDate}</td>
                  <td className="p-4 text-right flex items-center gap-3 justify-end">
                    <Link
                      href={`/dashboard/invoices/${invoice._id}`}
                      className="text-gray-400 hover:text-indigo-400 transition"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => deleteInvoice(invoice._id)}
                      className="text-gray-400 hover:text-red-500 transition"
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
  );
}
