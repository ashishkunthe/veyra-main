"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard"); // ✅ Already logged in → dashboard
    } else {
      router.replace("/auth/login"); // 🔐 Not logged in → login
    }
  }, [router]);

  return (
    <div className="flex bg-blackflex items-center justify-center min-h-screen bg-gradient-to-br from-black via-indigo-950 to-black text-white text-2xl">
      Redirecting...
    </div>
  );
}
