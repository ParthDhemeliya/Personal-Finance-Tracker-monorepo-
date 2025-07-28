"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// ProtectedLayout component to ensure user is authenticated
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in ProtectedLayout:", token);
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}
