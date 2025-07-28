"use client";

import { useState } from "react";
import { DollarSign, User, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../hooks/useTypedDispatch";
import { registerUser } from "../../redux/auth/authThunk";
import { motion } from "framer-motion";
import useToast from "../../hooks/useToast";
import { loginUser } from "../../redux/auth/authThunk";

const SignUp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!form.first_name.trim()) errors.first_name = "First name is required.";
    if (!form.last_name.trim()) errors.last_name = "Last name is required.";
    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email address.";
    }

    if (!form.password) errors.password = "Password is required.";
    else if (form.password.length < 6)
      errors.password = "Password must be at least 6 characters.";

    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  };

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
      const resultAction = await dispatch(
        registerUser({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
        }),
      );

      if (registerUser.fulfilled.match(resultAction)) {
        // Automatically log in after signup
        const loginResult = await dispatch(
          loginUser({
            email: form.email,
            password: form.password,
            first_name: form.first_name,
            last_name: form.last_name,
          }),
        );
        if (loginUser.fulfilled.match(loginResult)) {
          showSuccess("Account created successfully! Welcome to My Budget!");
          router.push("/dashboard");
        } else {
          showError(
            "Signup succeeded but login failed. Please log in manually.",
          );
          router.push("/login");
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload = (resultAction as any).payload;
        if (payload?.errors && Array.isArray(payload.errors)) {
          const serverErrors: { [key: string]: string } = {};
          payload.errors.forEach((err: { field: string; message: string }) => {
            serverErrors[err.field] = err.message;
          });
          setFieldErrors(serverErrors);
          showError("Please fix the errors above.");
        } else if (payload?.message) {
          const msg = payload.message.toLowerCase();
          if (msg.includes("user already exists")) {
            showError(
              "An account with this email already exists. Please login or use a different email.",
            );
            setFieldErrors({
              email:
                "An account with this email already exists. Please login or use a different email.",
            });
          } else {
            showError(payload.message);
            setFieldErrors({ general: payload.message });
          }
        } else {
          showError("An unexpected error occurred. Please try again.");
          setFieldErrors({
            general: "An unexpected error occurred. Please try again.",
          });
        }
      }
    } catch {
      showError("Network error. Please try again later.");
      setFieldErrors({
        general: "Network error. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (name: string) => {
    if (name === "email") return <Mail className="w-4 h-4 text-gray-400" />;
    if (name === "password" || name === "confirmPassword")
      return <Lock className="w-4 h-4 text-gray-400" />;
    return <User className="w-4 h-4 text-gray-400" />;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-blue-100"
      >
        <div className="flex items-center justify-center mb-6 text-2xl font-bold text-blue-900">
          <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
          My Budget
        </div>

        <h2 className="text-xl font-semibold text-center text-blue-800 mb-6">
          Create an Account
        </h2>

        {fieldErrors.general && (
          <div className="text-red-600 text-sm mb-4 text-center font-medium">
            {fieldErrors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {[
            { name: "first_name", type: "text", placeholder: "First Name" },
            { name: "last_name", type: "text", placeholder: "Last Name" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "password", type: "password", placeholder: "Password" },
            {
              name: "confirmPassword",
              type: "password",
              placeholder: "Confirm Password",
            },
          ].map(({ name, type, placeholder }) => (
            <div key={name} className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                {getIcon(name)}
              </div>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  fieldErrors[name]
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                aria-invalid={!!fieldErrors[name]}
              />
              {fieldErrors[name] && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
              )}
            </div>
          ))}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create an Account"}
          </motion.button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Login here
            </span>
          </p>
        </form>
      </motion.div>
    </section>
  );
};

export default SignUp;
