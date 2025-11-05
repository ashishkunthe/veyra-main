"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Building2, FileText, Briefcase } from "lucide-react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface Invoice {
  id: string;
  total: number;
  status: "paid" | "pending" | "Overdue";
  dueDate: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${backendUrl}/clients/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log(data);
        setClient({
          id: data.id,
          name: data.name,
          email: data.email,
          company: data.address || "—",
        });

        setInvoices(data.invoices);
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
    // <ProtectedRoute>
    <div className="min-h-screen text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Briefcase className="text-amber-400" />
          Client Details
        </h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition text-gray-400"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Client Info Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-10 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">{client.name}</h2>
        <div className="space-y-3 text-gray-500">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-amber-400" />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-amber-400" />
            <span>{client.company}</span>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="text-amber-400" /> Invoices
      </h2>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl max-w-5xl">
        <table className="w-full text-left text-sm md:text-base">
          <thead>
            <tr className="bg-white/10 text-gray-400">
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
                key={inv.id}
                className="border-t border-white/5 hover:bg-white/10 transition"
              >
                <td className="p-4 text-gray-500">{inv.id}</td>
                <td className="p-4 text-gray-500">${inv.total.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inv.status === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : inv.status === "pending"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{inv.dueDate}</td>
                <td className="p-4 text-right">
                  <Link
                    href={`/dashboard/invoices/${inv.id}`}
                    className="text-amber-400 hover:text-amber-300 font-medium"
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
    // </ProtectedRoute>
  );
}
