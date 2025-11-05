"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Save, Loader2, UserRound } from "lucide-react";

interface Profile {
  name: string;
  email: string;
  phone?: string;
  businessType?: string;
  country?: string;
  profileImageUrl?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<Profile>(`${backendUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err: unknown) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [backendUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${backendUrl}/profile`,
        { ...profile },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Profile updated successfully!");
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-[#ffffff] via-[#ffffff] to-[#ffffff]">
      <div className="max-w-2xl mx-auto p-8 rounded-2xl border border-amber-200 bg-white shadow-lg text-[#6c5a43]">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-amber-800">
          <UserRound className="text-amber-600" /> My Profile
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium bg-red-100 py-2 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          {profile.profileImageUrl ? (
            <Image
              src={profile.profileImageUrl}
              alt={profile.name}
              width={112}
              height={112}
              className="w-28 h-28 rounded-full border-4 border-amber-400 shadow-md object-cover bg-white"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-amber-200/50 border border-amber-300 flex items-center justify-center text-4xl font-semibold text-amber-700 shadow-inner">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-sm text-amber-700">Full Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white border border-amber-300 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-amber-700">Email</label>
            <input
              value={profile.email}
              disabled
              className="w-full mt-1 px-4 py-3 rounded-lg bg-amber-100/60 border border-amber-200 text-amber-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-amber-700">Phone</label>
            <input
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white border border-amber-300 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-amber-700">Business Type</label>
              <input
                name="businessType"
                value={profile.businessType || ""}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-lg bg-white border border-amber-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-sm text-amber-700">Country</label>
              <input
                name="country"
                value={profile.country || ""}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-lg bg-white border border-amber-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-amber-700">Profile Image URL</label>
            <input
              name="profileImageUrl"
              value={profile.profileImageUrl || ""}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white border border-amber-300 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 transition-all py-3 rounded-lg font-semibold text-white shadow-lg shadow-amber-500/30 disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
