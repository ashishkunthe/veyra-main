"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Building2, FileText, Briefcase } from "lucide-react";
import Link from "next/link";

interface Client {
  _id: string;
  name: string;
  email: string;
  company: string;
}

interface Invoice {
  _id: string;
  total: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:4000/clients/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setClient({
          _id: data.id,
          name: data.name,
          email: data.email,
          company: data.address || "—",
        });

        // Later we’ll link invoices to this client (GET /invoices?clientId=)
        setInvoices([]);
      } catch (err) {
        console.error("Failed to fetch client details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-gray-400 text-lg mt-10 text-center">
        Loading client details...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-red-400 text-lg mt-10 text-center">
        Client not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Briefcase className="text-indigo-400" />
          Client Details
        </h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition text-gray-300"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Client Info Card */}
      <div className="bg-[#141124] border border-white/10 rounded-2xl p-6 md:p-8 mb-10 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">{client.name}</h2>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-indigo-400" />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-indigo-400" />
            <span>{client.company}</span>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="text-indigo-400" /> Invoices
      </h2>

      <div className="overflow-x-auto bg-[#141124] border border-white/10 rounded-2xl max-w-5xl">
        <table className="w-full text-left text-sm md:text-base">
          <thead>
            <tr className="bg-white/5 text-gray-400">
              <th className="p-4 font-medium">Invoice ID</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Due Date</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv._id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-4 text-gray-200">{inv._id}</td>
                <td className="p-4 text-gray-200">${inv.total.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inv.status === "Paid"
                        ? "bg-green-500/20 text-green-400"
                        : inv.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{inv.dueDate}</td>
                <td className="p-4 text-right">
                  <Link
                    href={`/dashboard/invoices/${inv._id}`}
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
