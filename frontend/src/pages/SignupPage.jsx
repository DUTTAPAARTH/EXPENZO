import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  DollarSign,
  CheckCircle,
} from "lucide-react";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currencies = [
    { code: "INR", name: "Indian Rupee (₹)", symbol: "₹" },
    { code: "USD", name: "US Dollar ($)", symbol: "$" },
    { code: "EUR", name: "Euro (€)", symbol: "€" },
    { code: "GBP", name: "British Pound (£)", symbol: "£" },
    { code: "JPY", name: "Japanese Yen (¥)", symbol: "¥" },
    { code: "AUD", name: "Australian Dollar (A$)", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar (C$)", symbol: "C$" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", {
        name: fullName,
        email: email.toLowerCase().trim(),
        password,
        avatar: "😊",
      });

      if (response.data.success) {
        toast.success(
          response.data.message || "🎉 Account created successfully!"
        );

        // Store token and user data
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        // Redirect to onboarding
        setTimeout(() => {
          navigate("/onboarding");
        }, 1000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);

      let errorMessage = "Failed to create account. Please try again.";

      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        // Request made but no response
        errorMessage =
          "Cannot connect to server. Please check if backend is running.";
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card Container */}
        <div className="relative">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8 space-y-6">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
                Expenzo
              </h1>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">
                Create your Expenzo account
              </h2>
              <p className="text-slate-400 text-sm">
                Set up your account and start tracking your expenses in minutes.
              </p>
            </div>

            {/* Error Message Area */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-500 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-300"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="space-y-2">
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-slate-300"
                >
                  Default currency
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-500" />
                  </div>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    {currencies.map((curr) => (
                      <option
                        key={curr.code}
                        value={curr.code}
                        className="bg-slate-900 text-white"
                      >
                        {curr.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-dark-base font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-dark-base border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Create account</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative bg-slate-900/60 px-4">
                <span className="text-sm text-slate-500">or</span>
              </div>
            </div>

            {/* Social Signup (Optional) */}
            <button
              type="button"
              disabled
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-400 font-medium py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center gap-3 opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign up with Google (coming soon)</span>
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-primary-500 hover:text-primary-400 font-semibold transition-colors underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-2xl blur-xl -z-10 opacity-50"></div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
