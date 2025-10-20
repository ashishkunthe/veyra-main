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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch company details when the page loads
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/company`, {
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
        await axios.put(`http://localhost:4000/company/${companyId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Company info updated successfully!");
      } else {
        // Create new company
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/company`,
          body,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Building2 className="text-indigo-400" /> Company Details
      </h1>

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

        {/* Tax Info */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Tax Info</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Logo URL (optional)
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>

        {message && (
          <p className="text-sm font-medium text-green-400">{message}</p>
        )}

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
