"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Building2, Save } from "lucide-react";

export default function CompanyPage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [message, setMessage] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch company details when the page loads
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${backendUrl}/company`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setCompanyId(data.id);
        setCompanyName(data.name);
        setAddress(data.address);
        setTaxId(data.taxInfo);
        setLogoUrl(data.logoUrl);
      } catch (err) {
        console.log("No company data yet — maybe new user.");
      }
    };
    fetchCompany();
  }, [token]);

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      const body = {
        name: companyName,
        logoUrl,
        address,
        taxInfo: taxId,
      };

      if (companyId) {
        // Update existing company
        await axios.put(`${backendUrl}/company/${companyId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Company info updated successfully!");
      } else {
        // Create new company
        const res = await axios.post(`${backendUrl}/company`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanyId(res.data.id);
        setMessage("✅ Company created successfully!");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to save company info");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    // <ProtectedRoute>
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] text-gray-900 px-4">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2 text-amber-600">
        <Building2 className="text-amber-600" /> Company Details
      </h1>

      <form
        onSubmit={handleSave}
        className="w-full max-w-3xl bg-white border border-amber-300/40 rounded-2xl p-8 space-y-6 shadow-lg shadow-amber-200/30"
      >
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-white border border-amber-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Address
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-white border border-amber-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Tax Info */}
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Tax Info
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-white border border-amber-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Logo URL (optional)
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-white border border-amber-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>

        {message && (
          <p className="text-sm font-medium text-green-600">{message}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-lg font-semibold text-white transition-all"
          >
            <Save size={20} /> Save Changes
          </button>
        </div>
      </form>
    </div>
    // </ProtectedRoute>
  );
}
