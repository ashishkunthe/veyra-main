"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, CheckCircle2, Send } from "lucide-react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvoice(res.data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:4000/invoices/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const pdfUrl = res.data.pdfUrl;
      if (!pdfUrl) throw new Error("No PDF URL received");

      // 🧾 Open PDF in new tab
      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error("Error opening PDF:", err);
      alert("Failed to open invoice PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleSend = async () => {
    try {
      setSending(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4000/invoices/${id}/send`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("📨 Invoice sent to client successfully!");
    } catch (err) {
      console.error("Error sending invoice:", err);
      alert("Failed to send invoice email");
    } finally {
      setSending(false);
    }
  };

  const markAsPaid = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/invoices/${id}`,
        { status: "paid" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvoice({ ...invoice, status: "paid" });
      alert("✅ Invoice marked as paid!");
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return (
      // <ProtectedRoute>
      <div className="text-center text-gray-400 py-20">Loading invoice...</div>
      // </ProtectedRoute>
    );
  }

  if (!invoice) {
    return (
      // <ProtectedRoute>
      <div className="text-center text-gray-400 py-20">Invoice not found 🫤</div>
      // </ProtectedRoute>
    );
  }

  return (
    // <ProtectedRoute>
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-md">
      {/* 🔙 Back Button */}
      <button
        onClick={() => router.push("/dashboard/invoices")}
        className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 font-medium"
      >
        <ArrowLeft size={20} /> Back to Invoices
      </button>

      {/* 🧾 Invoice Header */}
      {/* 🧾 Invoice Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-500">
            Invoice #{invoice.id}
          </h1>
          <p className="text-gray-600">
            Issued on {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            Status:{" "}
            <span
              className={`font-semibold ${
                invoice.status === "paid"
                  ? "text-green-600"
                  : invoice.status === "pending"
                  ? "text-amber-600"
                  : "text-red-600"
              }`}
            >
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </p>

          {/* 🌀 Recurring Info */}
          {invoice.isRecurring && (
            <p className="text-gray-600 mt-1">
              Recurring:{" "}
              <span className="font-semibold text-amber-600">
                {invoice.recurrenceInterval
                  ? invoice.recurrenceInterval.charAt(0).toUpperCase() +
                    invoice.recurrenceInterval.slice(1)
                  : "Yes"}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
          >
            <Download size={18} />
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
          >
            <Send size={18} /> {sending ? "Sending..." : "Send to Client"}
          </button>
          {invoice.status !== "paid" && (
            <button
              onClick={markAsPaid}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              <CheckCircle2 size={18} /> Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* 👤 Client Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Client Information
        </h2>
        <p className="text-gray-500">
          <strong>Name:</strong> {invoice.clientName}
        </p>
        <p className="text-gray-500">
          <strong>Email:</strong> {invoice.clientEmail}
        </p>
        <p className="text-gray-500">
          <strong>Due Date:</strong>{" "}
          {new Date(invoice.dueDate).toLocaleDateString()}
        </p>
      </div>

      {/* 📦 Items Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Invoice Items
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-gray-600 bg-amber-50/40">
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4 text-center">Qty</th>
                <th className="py-2 px-4 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: any, i: number) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-amber-50/40 transition"
                >
                  <td className="py-2 px-4">{item.description}</td>
                  <td className="py-2 px-4 text-center">{item.qty}</td>
                  <td className="py-2 px-4 text-right">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 💰 Payment Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-8">
        <h2 className="text-lg font-semibold mb-3 text-amber-700">
          Payment Details
        </h2>
        <p className="text-gray-800 whitespace-pre-wrap">
          {invoice.paymentDetails || "No payment details provided."}
        </p>
      </div>

      {/* 💵 Total */}
      <div className="text-right text-2xl font-bold text-amber-700 mt-6">
        Total: ₹{invoice.total}
      </div>
    </div>
    // </ProtectedRoute>
  );
}
