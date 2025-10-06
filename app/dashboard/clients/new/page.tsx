"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) {
      setError("An error occurred. Please check your input and try again.");
      return;
    }

    try {
      console.log("New client added:", { name, email, company });
      router.push("/dashboard/clients");
    } catch (err) {
      setError("An error occurred. Please check your input and try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-transparent text-white px-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Add New Client
        </h1>
        <Link
          href="/dashboard/clients"
          className="flex items-center gap-1 text-gray-400 hover:text-indigo-400 transition text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#11112B]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#1E1E3F] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. johndoe@example.com"
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#1E1E3F] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Veyra Inc."
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#1E1E3F] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#5B4BFF] hover:bg-[#4A3DDB] transition-all duration-200 py-3 rounded-lg font-medium text-white mt-2"
          >
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
}
