import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Shield,
  Smartphone,
  PieChart,
  ArrowRight,
  Play,
  Star,
  Zap,
  Target,
  BarChart3,
  CreditCard,
  Brain,
  Globe,
  CheckCircle,
} from "lucide-react";

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-500 via-white to-primary-50 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-300 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <motion.nav
        className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 z-50 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img
                src="/logo.svg"
                alt="Expenzo Logo"
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  // Fallback to text logo if image not found
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "flex";
                }}
              />
              <div
                className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center"
                style={{ display: "none" }}
              >
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Expenzo
              </div>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {["Home", "Features", "About"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-primary-500 transition-colors font-medium relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                </motion.a>
              ))}
            </div>

            {/* Auth Buttons */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary-500 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center space-x-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Zap size={16} />
                <span>Smart Finance Management</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-heading font-bold text-dark-base mb-6 leading-tight"
              >
                Track. Split. Save —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500">
                  The Smarter Way
                </span>{" "}
                to Manage Money.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl"
              >
                Expenzo automatically detects your spends, helps you budget
                better, and simplifies group expenses. Take control of your
                finances with AI-powered insights.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="group bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-semibold text-lg flex items-center justify-center space-x-2 relative overflow-hidden"
                  >
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight
                      className="group-hover:translate-x-1 transition-transform relative z-10"
                      size={20}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                </motion.div>

                <motion.button
                  className="group border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-xl hover:bg-primary-500 hover:text-white transition-all font-semibold text-lg flex items-center justify-center space-x-2 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={20} />
                  <span>Try Demo</span>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center lg:justify-start space-x-8"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-dark-base">50K+</div>
                  <div className="text-sm text-gray-600">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-dark-base">₹10M+</div>
                  <div className="text-sm text-gray-600">Money Tracked</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-2xl font-bold text-dark-base">
                      4.9
                    </span>
                    <Star
                      className="text-yellow-400 fill-current ml-1"
                      size={20}
                    />
                  </div>
                  <div className="text-sm text-gray-600">User Rating</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Main Dashboard Mockup */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-700">
                {/* Browser Header */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 flex items-center px-3">
                    <span className="text-xs text-gray-500">
                      expenzo.app/dashboard
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-dark-base text-lg">
                      💰 Dashboard
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      October 2025
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-sm text-primary-600 mb-1">
                        This Month
                      </div>
                      <div className="text-2xl font-bold text-primary-700">
                        ₹24,890
                      </div>
                      <div className="text-xs text-primary-600 flex items-center mt-1">
                        <TrendingUp size={12} className="mr-1" />
                        +12% from last month
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-sm text-secondary-600 mb-1">
                        Saved
                      </div>
                      <div className="text-2xl font-bold text-secondary-700">
                        ₹8,200
                      </div>
                      <div className="text-xs text-secondary-600 flex items-center mt-1">
                        <Target size={12} className="mr-1" />
                        Goal: ₹10,000
                      </div>
                    </motion.div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-32 bg-gradient-to-r from-primary-100 via-secondary-100 to-accent-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      variants={floatingVariants}
                      animate="float"
                      className="text-4xl z-10"
                    >
                      📊
                    </motion.div>
                    {/* Animated chart lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      <motion.path
                        d="M 20 80 Q 60 40 100 60 T 180 50 T 260 70"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#FFC300" />
                          <stop offset="50%" stopColor="#2ECCB0" />
                          <stop offset="100%" stopColor="#00AEEF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Recent Transactions */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">
                      Recent Expenses
                    </div>
                    {[
                      {
                        emoji: "🍕",
                        name: "Pizza Corner",
                        amount: "₹680",
                        time: "2h ago",
                        color: "red",
                      },
                      {
                        emoji: "🚕",
                        name: "Uber Ride",
                        amount: "₹240",
                        time: "4h ago",
                        color: "blue",
                      },
                      {
                        emoji: "☕",
                        name: "Starbucks",
                        amount: "₹420",
                        time: "1d ago",
                        color: "green",
                      },
                    ].map((expense, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.5 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{expense.emoji}</span>
                          <div>
                            <div className="text-sm font-medium text-dark-base">
                              {expense.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {expense.time}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-bold text-${expense.color}-500`}
                        >
                          -{expense.amount}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-8 -left-8 bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-xl"
                variants={floatingVariants}
                animate="float"
              >
                <Brain className="text-white" size={28} />
              </motion.div>

              <motion.div
                className="absolute -bottom-8 -right-8 bg-gradient-to-r from-secondary-500 to-accent-500 p-4 rounded-2xl shadow-xl"
                variants={floatingVariants}
                animate="float"
                transition={{ delay: 1.5 }}
              >
                <BarChart3 className="text-white" size={28} />
              </motion.div>

              <motion.div
                className="absolute top-16 -right-12 bg-gradient-to-r from-accent-500 to-primary-500 p-3 rounded-xl shadow-lg"
                variants={floatingVariants}
                animate="float"
                transition={{ delay: 0.7 }}
              >
                <CreditCard className="text-white" size={20} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Star size={16} />
              <span>Powerful Features</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark-base mb-6">
              Why Choose Expenzo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of expense management with our cutting-edge
              features designed to make your financial life effortless and
              intelligent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description:
                  "Advanced machine learning algorithms analyze your spending patterns and provide personalized financial insights to help you make smarter decisions.",
                color: "primary",
                gradient: "from-primary-500 to-primary-600",
              },
              {
                icon: Users,
                title: "Smart Group Splitting",
                description:
                  "Effortlessly split bills with friends and family. Our intelligent system calculates fair shares and tracks settlements automatically.",
                color: "secondary",
                gradient: "from-secondary-500 to-secondary-600",
              },
              {
                icon: BarChart3,
                title: "Visual Analytics",
                description:
                  "Beautiful, interactive charts and real-time dashboards transform your financial data into actionable insights you can understand at a glance.",
                color: "accent",
                gradient: "from-accent-500 to-accent-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                <motion.div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="text-white" size={32} />
                </motion.div>

                <h3 className="text-2xl font-bold text-dark-base mb-4 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <motion.div
                  className="flex items-center text-primary-600 font-medium group-hover:text-primary-700"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn more</span>
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About/CTA Section */}
      <section
        id="about"
        className="py-24 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/80 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Globe size={16} />
                <span>Trusted Worldwide</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark-base mb-6">
                Built for the Modern Financial Lifestyle
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Expenzo combines cutting-edge technology with intuitive design
                to create the ultimate expense management experience. From
                AI-powered categorization to seamless group splitting, we're
                reimagining how you handle money.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Real-time expense tracking with instant categorization",
                  "Advanced analytics and predictive spending insights",
                  "Bank-level security with end-to-end encryption",
                  "24/7 customer support and regular feature updates",
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="text-white" size={18} />
                    </div>
                    <span className="text-gray-700 font-medium">{point}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-semibold text-lg"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
                <div className="text-center">
                  <motion.div
                    className="text-8xl mb-6"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    💡
                  </motion.div>
                  <h3 className="text-3xl font-bold text-dark-base mb-4">
                    Ready to Transform Your Finances?
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Join over 50,000 users who have already revolutionized their
                    spending habits with Expenzo's intelligent platform.
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { number: "50K+", label: "Active Users" },
                      { number: "₹10M+", label: "Money Managed" },
                      { number: "4.9⭐", label: "App Rating" },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="text-center"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                      >
                        <div className="text-2xl font-bold text-primary-600">
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-semibold inline-flex items-center space-x-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-base text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-base via-gray-900 to-dark-base"></div>

        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <motion.div
                className="flex items-center space-x-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <img
                  src="/logo.svg"
                  alt="Expenzo Logo"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl items-center justify-center hidden"
                  style={{ display: "none" }}
                >
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <div className="text-3xl font-heading font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  Expenzo
                </div>
              </motion.div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                The smarter way to track, split, and save money. Built for the
                modern financial lifestyle with cutting-edge technology and
                intuitive design.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "GitHub", "Instagram"].map(
                  (social, index) => (
                    <motion.a
                      key={social}
                      href="#"
                      className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all"
                      whileHover={{ scale: 1.1, y: -2 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-sm font-medium">{social[0]}</span>
                    </motion.a>
                  )
                )}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Mobile App", "API"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Press"],
              },
              {
                title: "Support",
                links: [
                  "Help Center",
                  "Contact Us",
                  "Privacy Policy",
                  "Terms of Service",
                ],
              },
            ].map((column, index) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <h4 className="font-bold mb-4 text-lg">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        className="text-gray-400 hover:text-primary-500 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-gray-400 mb-4 md:mb-0">
              ©2025 Expenzo. All rights reserved.
            </div>

            <div className="text-gray-400 text-sm">
              Made with ❤️ for better financial management
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
