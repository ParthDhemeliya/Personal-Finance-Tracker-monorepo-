// NavBar.tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import ProfilePopup from "./ProfilePopup";
import { DollarSign, ChevronDown, ChevronRight } from "lucide-react";
import { useAppSelector } from "../hooks/useTypedSelector";
import { useAppDispatch } from "../hooks/useTypedDispatch";
import SidebarLinks from "./SidebarLinks";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/redux/store";
import useToast from "../hooks/useToast";
import { logout } from "@/redux/auth/authThunk";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const { showSuccess } = useToast();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, loading, hasFetchedUser } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const userFirstName = user?.first_name;
  const userFullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`;

  const handleLogout = async () => {
    localStorage.removeItem("token");
    // await dispatch(logout());
    showSuccess("Logged out successfully!");
    router.replace("/");
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isPopupOpen]);

  // Show loading state if user info is not loaded
  if (!hasFetchedUser || loading) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-blue-50 border-b border-blue-100/80">
        <div className="h-14 px-6 flex items-center justify-between">
          <div className="animate-pulse flex items-center gap-2">
            <div className="h-6 w-6 bg-blue-200 rounded-full" />
            <div className="h-6 w-32 bg-blue-200 rounded" />
          </div>
          <div className="h-8 w-32 bg-blue-200 rounded animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full z-50 bg-blue-50 border-b border-blue-100/80">
        <div className="h-14 px-6 flex items-center justify-between">
          <button
            className="sm:hidden text-blue-800"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-700" />
            <span className="text-xl font-bold text-blue-900">My Budget</span>
          </Link>

          <div className="relative" ref={popupRef}>
            <div
              onClick={() => setIsPopupOpen((prev) => !prev)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                className="w-8 h-8 rounded-full border border-blue-200"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="User"
              />
              <span className="text-sm font-medium text-blue-900 hidden sm:inline">
                {userFirstName}
              </span>
            </div>

            {isPopupOpen && (
              <ProfilePopup
                user={
                  user
                    ? {
                        name: userFullName,
                        email: user.email,
                        profile:
                          "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
                      }
                    : undefined
                }
                onClose={() => setIsPopupOpen(false)}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 bg-blue-50 border-r border-blue-100/80 shadow-sm sm:hidden"
            >
              <div className="relative h-full px-4 py-6 space-y-2">
                <button
                  className="absolute top-4 right-4 text-blue-900"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  ✕
                </button>
                <SidebarLinks
                  currentPath={pathname ?? ""}
                  onNavigate={() => setIsSidebarOpen(false)}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden sm:block fixed top-0 left-0 z-40 w-64 h-screen pt-14 bg-blue-50 border-r border-blue-100/80 shadow-sm">
        <div className="h-full px-4 py-6 space-y-2">
          <button
            onClick={() => setIsSidebarVisible((prev) => !prev)}
            className="w-full flex items-center justify-start gap-2 px-4 py-2 mb-2 rounded-lg text-sm font-semibold text-blue-800 bg-blue-100 hover:bg-blue-200 transition"
          >
            {isSidebarVisible ? (
              <>
                <ChevronDown className="w-4 h-4" />
                Hide Menu
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                Show Menu
              </>
            )}
          </button>
          {isSidebarVisible && <SidebarLinks currentPath={pathname ?? ""} />}
        </div>
      </aside>
    </div>
  );
};

export default NavBar;
