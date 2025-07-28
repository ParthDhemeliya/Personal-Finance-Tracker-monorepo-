import toast from "react-hot-toast";

/**
 * Custom hook for displaying toast notifications throughout the app
 * Uses react-hot-toast library for consistent notification styling
 */
const useToast = () => {
  /**
   * Display a success toast notification
   * @param message - The success message to display
   */
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000, // Auto-close after 3 seconds
      position: "top-right", // Position in top-right corner
      style: {
        background: "#10B981", // Green background for success
        color: "#fff", // White text
        zIndex: 9999, // Ensure it appears above other elements
      },
    });
  };

  /**
   * Display an error toast notification
   * @param message - The error message to display
   */
  const showError = (message: string) => {
    toast.error(message, {
      duration: 4000, // Auto-close after 4 seconds (longer for errors)
      position: "top-right", // Position in top-right corner
      style: {
        background: "#EF4444", // Red background for errors
        color: "#fff", // White text
        zIndex: 9999, // Ensure it appears above other elements
      },
    });
  };

  /**
   * Display an info toast notification
   * @param message - The info message to display
   */
  const showInfo = (message: string) => {
    toast(message, {
      duration: 3000, // Auto-close after 3 seconds
      position: "top-right", // Position in top-right corner
      style: {
        background: "#363636", // Gray background for info
        color: "#fff", // White text
        zIndex: 9999, // Ensure it appears above other elements
      },
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
};

export default useToast;
