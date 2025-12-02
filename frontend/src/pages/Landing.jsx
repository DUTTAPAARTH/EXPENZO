import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-500 via-primary-100 to-secondary-100 dark:from-dark-base dark:via-dark-100 dark:to-dark-200">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo and Brand */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-8xl font-heading font-bold text-funky mb-4">
                💸 Expenzo
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-dark-base dark:text-white">
                Track Smart. Spend Bold.
              </p>
            </motion.div>

            {/* Hero Description */}
            <motion.div
              className="max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                The <span className="font-bold text-primary-500">Gen-Z</span>{" "}
                way to manage your money! Smart expense tracking with AI
                insights, funky design, and social features. Built for{" "}
                <span className="font-bold text-secondary-500">
                  HeisenHack 2024
                </span>{" "}
                🎯
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-4 group inline-flex items-center"
              >
                Get Started Free
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  🚀
                </span>
              </Link>

              <Link to="/signin" className="btn-outline text-lg px-8 py-4">
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Feature Cards */}
            {[
              {
                emoji: "🤖",
                title: "AI-Powered Insights",
                description:
                  "Smart spending analysis with personalized recommendations and fun insights about your money habits.",
              },
              {
                emoji: "📊",
                title: "Visual Analytics",
                description:
                  "Beautiful charts and graphs that make your financial data easy to understand and actionable.",
              },
              {
                emoji: "👥",
                title: "Group Expenses",
                description:
                  "Split bills with friends seamlessly. Track who owes what with automatic settlement suggestions.",
              },
              {
                emoji: "📱",
                title: "SMS Detection",
                description:
                  "Automatically extract expense details from bank SMS messages using smart pattern recognition.",
              },
              {
                emoji: "🎨",
                title: "Gen-Z Design",
                description:
                  "Vibrant, funky interface with animations and emojis that make expense tracking fun and engaging.",
              },
              {
                emoji: "🔒",
                title: "Secure & Private",
                description:
                  "Bank-level security with JWT authentication and encrypted data storage for your peace of mind.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card hover:glow-primary group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4 group-hover:animate-bounce">
                  {feature.emoji}
                </div>
                <h3 className="text-xl font-bold text-dark-base dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="bg-white dark:bg-dark-100 rounded-card p-8 shadow-float mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "36", label: "Hour Hackathon", emoji: "⏰" },
                { number: "100%", label: "Gen-Z Vibes", emoji: "🎉" },
                { number: "∞", label: "Fun Tracking", emoji: "😄" },
                { number: "🔥", label: "HeisenHack 2024", emoji: "🏆" },
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-2xl mt-2 group-hover:animate-bounce">
                    {stat.emoji}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <h2 className="text-2xl font-bold text-dark-base dark:text-white mb-6">
              Built with Modern Tech 🛠️
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "React",
                "Node.js",
                "MongoDB",
                "TailwindCSS",
                "Chart.js",
                "JWT",
                "Express",
                "Vite",
              ].map((tech, index) => (
                <motion.span
                  key={tech}
                  className="bg-primary-500 text-dark-base px-4 py-2 rounded-full font-semibold text-sm hover:bg-primary-400 transition-colors cursor-default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 2.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            className="text-center mt-16 pt-16 border-t border-gray-200 dark:border-dark-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <h2 className="text-3xl font-bold text-dark-base dark:text-white mb-4">
              Ready to Transform Your Money Game? 💰
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the expense tracking revolution. No more boring spreadsheets,
              just fun, smart, and social money management.
            </p>
            <Link
              to="/signup"
              className="btn-primary text-xl px-12 py-6 group inline-flex items-center glow-primary"
            >
              Start Your Journey
              <span className="ml-3 group-hover:rotate-12 transition-transform">
                ✨
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
