import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  PieChart,
  Brain,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const AuthLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Brand Pill */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-semibold">Expenzo</span>
              <span className="text-xs text-gray-400 border-l border-gray-600 pl-2">
                Track Smart. Spend Bold.
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Take control of{" "}
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-transparent bg-clip-text">
                your money
              </span>
              , not the other way around.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 leading-relaxed"
            >
              Expenzo helps you understand your spending habits, make smarter
              financial decisions, and achieve your money goals—all in one
              beautiful, Gen-Z friendly app.
            </motion.p>

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    See where your money goes
                  </h3>
                  <p className="text-sm text-gray-400">
                    Track every rupee with zero effort
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary-500/10 flex items-center justify-center group-hover:bg-secondary-500/20 transition-colors">
                  <PieChart className="w-5 h-5 text-secondary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Visual breakdowns that make sense
                  </h3>
                  <p className="text-sm text-gray-400">
                    Charts and graphs you'll actually want to look at
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center group-hover:bg-accent-500/20 transition-colors">
                  <Brain className="w-5 h-5 text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Smart insights powered by AI
                  </h3>
                  <p className="text-sm text-gray-400">
                    Get personalized tips to save more money
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            <div className="relative">
              {/* Glassmorphism Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8 space-y-6">
                {/* Card Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">
                    Welcome to Expenzo
                  </h2>
                  <p className="text-gray-400">
                    New here or already tracking your expenses with us?
                  </p>
                </div>

                {/* Auth Buttons */}
                <div className="space-y-4">
                  {/* Sign Up Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/register")}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-dark-base font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-glow hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <span>I'm new – Create my account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  {/* Log In Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/login")}
                    className="w-full border-2 border-primary-500/50 hover:border-primary-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:bg-primary-500/10 flex items-center justify-center gap-2"
                  >
                    <span>I already use Expenzo – Log in</span>
                  </motion.button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative bg-slate-950 px-4">
                    <span className="text-sm text-gray-500">or</span>
                  </div>
                </div>

                {/* Google Sign In (Coming Soon) */}
                <button
                  disabled
                  className="w-full bg-white/5 border border-white/10 text-gray-400 font-medium py-4 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-3 opacity-60"
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
                  <span>Continue with Google (coming soon)</span>
                </button>

                {/* Terms */}
                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  By continuing, you agree to Expenzo's{" "}
                  <button className="text-primary-500 hover:text-primary-400 underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="text-primary-500 hover:text-primary-400 underline">
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>

              {/* Decorative glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-2xl blur-xl -z-10 opacity-50"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
