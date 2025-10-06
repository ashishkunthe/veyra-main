"use client";
import { useState } from "react";
import { Building2, Save } from "lucide-react";

export default function CompanyPage() {
  const [companyName, setCompanyName] = useState("Veyra Inc.");
  const [address, setAddress] = useState(
    "123 Innovation Drive, Tech City, 10101"
  );
  const [taxId, setTaxId] = useState("AB123456789");
  const [email, setEmail] = useState("contact@veyra.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [message, setMessage] = useState("");

  const handleSave = (e: any) => {
    e.preventDefault();
    console.log({ companyName, address, taxId, email, phone });
    setMessage("✅ Company info saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Building2 className="text-indigo-400" /> Company Details
      </h1>

      {/* Form Container */}
      <form
        onSubmit={handleSave}
        className="w-full max-w-3xl bg-transparent border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl"
      >
        {/* Company Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Company Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Address</label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Tax ID */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Tax ID</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>

        {/* Email & Phone side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Phone</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Success message */}
        {message && (
          <p className="text-green-400 text-sm font-medium">{message}</p>
        )}

        {/* Save Button (bottom-right aligned) */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            <Save size={20} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
