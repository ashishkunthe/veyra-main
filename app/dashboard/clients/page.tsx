"use client";
import { useState, useEffect } from "react";
import { PlusCircle, Eye, Trash2, Users } from "lucide-react";
import Link from "next/link";

interface Client {
  _id: string;
  name: string;
  email: string;
  company: string;
  totalInvoices: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:4000/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setClients(
          data.map((c: any) => ({
            _id: c.id,
            name: c.name,
            email: c.email,
            company: c.address || "—",
            totalInvoices: c.invoices?.length || 0,
          }))
        );
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const deleteClient = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:4000/clients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete client:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 text-lg mt-10">
        Loading clients...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-amber-500/20 text-amber-400">
            <Users className="animate-pulse-slow" />
          </span>
          Clients
        </h1>
        <Link
          href="/dashboard/clients/new"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg transition text-sm font-medium"
        >
          <PlusCircle size={18} /> Add Client
        </Link>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto bg-white/5 border border-black rounded-2xl backdrop-blur-lg">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-gray-700 text-sm border-b border-gray-600">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Total Invoices</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-700">
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client._id}
                  className="border-b border-gray-700 hover:bg-black/10 transition"
                >
                  <td className="p-4 text-gray-700">{client.name}</td>
                  <td className="p-4 text-gray-700">{client.email}</td>
                  <td className="p-4 text-gray-700">{client.company}</td>
                  <td className="p-4 text-gray-700">{client.totalInvoices}</td>
                  <td className="p-4 text-right flex items-center gap-3 justify-end">
                    <Link
                      href={`/dashboard/clients/${client._id}`}
                      className="text-gray-400 hover:text-amber-400 transition"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => deleteClient(client._id)}
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
