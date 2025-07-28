"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useTypedSelector";
import { useAppDispatch } from "@/hooks/useTypedDispatch";
import { fetchUser } from "@/redux/auth/authThunk";

interface ProtectedRouteProps {
  children: React.ReactNode;
}
// ProtectedRoute component to check authentication
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, hasFetchedUser } = useAppSelector(
    (state) => state.auth,
  );
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        const currentPath = window.location.pathname;
        router.replace(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (token && !user && !hasFetchedUser) {
        try {
          await dispatch(fetchUser()).unwrap();
        } catch {
          localStorage.removeItem("token");
          const currentPath = window.location.pathname;
          router.replace(
            `/login?redirectTo=${encodeURIComponent(currentPath)}`,
          );
        }
      }
      setIsCheckingAuth(false);
    };
    checkAuthentication();
  }, [dispatch, router, user, hasFetchedUser]);

  // Removed getCookie utility and document.cookie usage as cookies are no longer used for authentication.

  if (isCheckingAuth || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
