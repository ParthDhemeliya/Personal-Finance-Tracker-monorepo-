import React, { useRef } from "react";
// import { logout } from "@/redux/auth/authThunk";

interface ProfilePopupProps {
  onLogout: () => void;
  onClose: () => void;
  user?: {
    profile?: string;
    name?: string;
    email?: string;
  };
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({
  onLogout,
  onClose,
  user,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={popupRef}
      className="fixed right-0 mt-2 w-64  bg-blue-50 shadow-lg rounded-lg z-50 p-4"
    >
      <div className="flex items-center space-x-3 mb-4">
        <img
          className="w-12 h-12 rounded-full"
          src={
            user?.profile ||
            "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          }
          alt="User"
        />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            {user?.name || "Neil Sims"}
          </p>
          <p className="text-xs font-semibold text-blue-900">
            {user?.email || "neil@example.com"}
          </p>
        </div>
      </div>
      <div className="flex justify-between space-x-2">
        <button
          onClick={onLogout}
          className="flex-1 py-1 text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded-md hover:text-red-900 transition cursor-pointer font-semibold"
        >
          Logout
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
