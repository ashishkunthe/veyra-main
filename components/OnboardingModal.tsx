"use client";
import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function OnboardingModal({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    businessType: "",
    country: "",
  });

  const [companyData, setCompanyData] = useState({
    name: "",
    address: "",
    logoUrl: "",
    taxInfo: "",
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleUserSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(`${backendUrl}/profile`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/company`, companyData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 overflow-hidden relative">
        {/* Header top section */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between text-sm font-medium text-gray-600">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? "50%" : "100%"}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-1 rounded mt-2 mb-6">
            <div
              className="h-full bg-amber-500 rounded transition-all"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Welcome! Let&apos;s get you set up
          </h2>

          <p className="mt-2 text-gray-700 font-medium">
            {step === 1 ? "Tell us about yourself" : "Your business details"}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Form Section */}
        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Business Type
                </label>
                <input
                  value={userData.businessType}
                  onChange={(e) =>
                    setUserData({ ...userData, businessType: e.target.value })
                  }
                  placeholder="Select a business type"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Country
                </label>
                <input
                  value={userData.country}
                  onChange={(e) =>
                    setUserData({ ...userData, country: e.target.value })
                  }
                  placeholder="Select your country"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Company Name
                </label>
                <input
                  value={companyData.name}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, name: e.target.value })
                  }
                  placeholder="Enter company name"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Company Address
                </label>
                <input
                  value={companyData.address}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, address: e.target.value })
                  }
                  placeholder="Enter company address"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Logo URL (optional)
                </label>
                <input
                  value={companyData.logoUrl}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, logoUrl: e.target.value })
                  }
                  placeholder="Link to company logo"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Tax Information (optional)
                </label>
                <input
                  value={companyData.taxInfo}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, taxInfo: e.target.value })
                  }
                  placeholder="Enter tax info"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-between items-center">
          <button
            disabled={step === 1}
            onClick={() => setStep(1)}
            className="text-gray-700 hover:text-gray-900 text-sm font-medium disabled:opacity-40"
          >
            Back
          </button>

          <button
            onClick={step === 1 ? handleUserSubmit : handleCompanySubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-60"
          >
            {step === 1 ? "Continue →" : "Finish ✅"}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onComplete}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
