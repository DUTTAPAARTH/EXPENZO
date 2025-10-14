import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { isValidEmail } from "../utils/helpers";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📝 Form submitted with:", {
      email: formData.email,
      password: "***",
    });

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Attempting login...");
      const result = await login({
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      console.log("📊 Login result:", result);

      if (result.success) {
        console.log("✅ Login successful, navigating to:", from);
        navigate(from, { replace: true });
      } else {
        console.log("❌ Login failed:", result.message);
      }
    } catch (error) {
      console.error("💥 Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo login
  const handleDemoLogin = async () => {
    setFormData({
      email: "demo@expenzo.com",
      password: "password123",
    });

    // Auto-submit after a brief delay
    setTimeout(() => {
      handleSubmit(new Event("submit"));
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Signing you in..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-100 to-primary-100 dark:from-dark-base dark:to-dark-100 flex items-center justify-center px-4 py-8">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-heading font-bold text-funky mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            💸 Welcome Back
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to track some expenses? Let's go! 🎯
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-10 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="📧 your.email@example.com"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="🔒 Your secure password"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="small" color="white" />
                  <span className="ml-2">Signing In...</span>
                </div>
              ) : (
                "Sign In 🚀"
              )}
            </button>

            {/* Demo Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full btn-secondary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Try Demo Account 🎭
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-secondary-500 hover:text-secondary-600 transition-colors"
            >
              Forgot your password? 🤔
            </Link>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center border-t border-gray-200 dark:border-dark-300 pt-6">
            <p className="text-gray-600 dark:text-gray-400">
              New to Expenzo?{" "}
              <Link
                to="/register"
                className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Quick Login Help */}
        <motion.div
          className="mt-8 p-4 bg-white dark:bg-dark-100 rounded-card shadow-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="font-semibold text-dark-base dark:text-white mb-2">
            🎯 Quick Start Tips:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Use demo account for instant access</li>
            <li>• Create your own account for personalized tracking</li>
            <li>• All your data is secure and encrypted</li>
          </ul>
        </motion.div>

        {/* Fun Footer */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🎯 Built for HeisenHack 2024 • Track Smart. Spend Bold. 💸
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
