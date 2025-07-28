"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../hooks/useTypedDispatch";
import { loginUser, fetchUser } from "../../redux/auth/authThunk";
import { DollarSign, Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { fetchUser } from "../../redux/auth/authThunk";
import useToast from "../../hooks/useToast";

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await dispatch(
        loginUser({
          email,
          password,
          first_name: "",
          last_name: "",
        }),
      );

      if (loginUser.fulfilled.match(res)) {
        // Fetch full user info before redirect
        const token: string = res.payload.token;
        localStorage.setItem("token", token);

        const userRes = await dispatch(fetchUser());

        showSuccess("Login successful! Welcome back!");
        router.push("/dashboard");
      } else {
        const payload = (res as { payload?: { message?: string } }).payload;
        if (payload?.message?.toLowerCase().includes("invalid zcredentials")) {
          showError("Invalid email or password. Please try again.");
          setFieldErrors({
            general: "Invalid email or password. Please try again.",
          });
        } else if (payload?.message?.toLowerCase().includes("network")) {
          showError(
            "Network error. Please check your connection and try again.",
          );
          setFieldErrors({
            general:
              "Network error. Please check your connection and try again.",
          });
        } else {
          showError(payload?.message || "Login failed. Please try again.");
          setFieldErrors({
            general: payload?.message || "Login failed. Please try again.",
          });
        }
      }
    } catch (err) {
      showError("Something went wrong. Please try again later.");
      setFieldErrors({
        general: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
        <div className="flex items-center justify-center mb-6 text-2xl font-bold text-blue-900">
          <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
          My Budget
        </div>

        <h2 className="text-xl font-semibold text-center text-blue-800 mb-6">
          Sign in to your account
        </h2>

        {fieldErrors.general && (
          <div className="text-red-600 text-sm mb-4 text-center font-medium">
            {fieldErrors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                fieldErrors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                fieldErrors.password
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              aria-invalid={!!fieldErrors.password}
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-blue-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
