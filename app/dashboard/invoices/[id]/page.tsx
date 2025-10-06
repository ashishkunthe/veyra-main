"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";

const mockInvoices = [
  {
    _id: "1",
    clientName: "Acme Corp",
    total: 1200,
    status: "Paid",
    dueDate: "2023-08-15",
    createdAt: "2023-07-01",
    items: [
      { description: "Website design", amount: 800 },
      { description: "Hosting (1 year)", amount: 400 },
    ],
  },
  {
    _id: "2",
    clientName: "Tech Solutions Inc.",
    total: 850,
    status: "Pending",
    dueDate: "2023-09-01",
    createdAt: "2023-07-20",
    items: [{ description: "Mobile App Development", amount: 850 }],
  },
  {
    _id: "3",
    clientName: "Global Innovations Ltd.",
    total: 1500,
    status: "Overdue",
    dueDate: "2023-07-20",
    createdAt: "2023-06-15",
    items: [{ description: "Custom CRM Software", amount: 1500 }],
  },
];

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const foundInvoice = mockInvoices.find((inv) => inv._id === id);
    setInvoice(foundInvoice || null);
  }, [id]);

  if (!invoice) {
    return (
      <div className="text-center text-gray-400 py-20">Invoice not found 🫤</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg">
      {/* 🔙 Back Button */}
      <button
        onClick={() => router.push("/dashboard/invoices")}
        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6"
      >
        <ArrowLeft size={20} /> Back to Invoices
      </button>

      {/* 🧾 Invoice Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Invoice #{invoice._id}</h1>
          <p className="text-gray-400">
            Issued on {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-400">
            Status:{" "}
            <span
              className={`font-semibold ${
                invoice.status === "Paid"
                  ? "text-green-400"
                  : invoice.status === "Pending"
                  ? "text-yellow-300"
                  : "text-red-400"
              }`}
            >
              {invoice.status}
            </span>
          </p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={() => alert("📄 Download coming soon!")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition"
          >
            <Download size={18} /> Download PDF
          </button>
          {invoice.status !== "Paid" && (
            <button
              onClick={() => alert("✅ Marked as Paid! (Dummy)")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
            >
              <CheckCircle2 size={18} /> Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* 👤 Client Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Client Information</h2>
        <p>
          <strong>Name:</strong> {invoice.clientName}
        </p>
        <p>
          <strong>Due Date:</strong> {invoice.dueDate}
        </p>
      </div>

      {/* 📦 Items Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Invoice Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-gray-400">
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: any, i: number) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="py-2 px-4">{item.description}</td>
                  <td className="py-2 px-4 text-right">₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 💰 Total */}
      <div className="text-right text-2xl font-bold text-indigo-400">
        Total: ₹{invoice.total}
      </div>
    </div>
  );
}
