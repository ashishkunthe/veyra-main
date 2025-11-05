"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        // No token → redirect to login
        if (!token) {
          router.replace("/auth/login");
          return;
        }
        const res = await fetch(`${backendUrl}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          router.replace("/auth/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        router.replace("/auth/login");
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [router, backendUrl]);

  // 🌀 Loading state while verifying
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <div className="animate-pulse text-lg">Checking authentication...</div>
      </div>
    );
  }

  // ✅ Render content if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
