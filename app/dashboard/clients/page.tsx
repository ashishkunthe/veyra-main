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
    // 🧪 Dummy Data
    const mockData: Client[] = [
      {
        _id: "1",
        name: "John Doe",
        email: "john@acme.com",
        company: "Acme Corp",
        totalInvoices: 12,
      },
      {
        _id: "2",
        name: "Jane Smith",
        email: "jane@techsolutions.io",
        company: "Tech Solutions",
        totalInvoices: 8,
      },
      {
        _id: "3",
        name: "Michael Johnson",
        email: "michael@globex.com",
        company: "Globex Inc",
        totalInvoices: 5,
      },
    ];

    setTimeout(() => {
      setClients(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const deleteClient = (id: string) => {
    setClients(clients.filter((c) => c._id !== id));
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
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-indigo-600/20 text-indigo-400">
            <Users className="animate-pulse-slow" />
          </span>
          Clients
        </h1>
        <Link
          href="/dashboard/clients/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm font-medium"
        >
          <PlusCircle size={18} /> Add Client
        </Link>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto bg-[#141124] border border-white/10 rounded-2xl">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-white/10">
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
                <td colSpan={5} className="text-center p-8 text-gray-400">
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4 text-gray-200">{client.name}</td>
                  <td className="p-4 text-gray-300">{client.email}</td>
                  <td className="p-4 text-gray-300">{client.company}</td>
                  <td className="p-4 text-gray-300">{client.totalInvoices}</td>
                  <td className="p-4 text-right flex items-center gap-3 justify-end">
                    <Link
                      href={`/dashboard/clients/${client._id}`}
                      className="text-gray-400 hover:text-indigo-400 transition"
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
