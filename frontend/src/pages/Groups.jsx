import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Calculator, 
  CreditCard, 
  Zap, 
  X,
  Wallet,
  BarChart3,
  Bell,
  Target,
  RefreshCw,
  Clock,
  Download,
  PieChart
} from "lucide-react";

const Groups = () => {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="min-h-screen bg-cream-500 dark:bg-dark-base">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header with Features Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-heading font-bold text-dark-base dark:text-white mb-2">
                👥 Group Expenses
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Split bills and track shared expenses with friends
              </p>
            </div>
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-button transition-colors border border-accent-600"
            >
              <Zap className="w-5 h-5" />
              <span>Features</span>
            </button>
          </div>

          {/* Premium Features Section */}
          <AnimatePresence>
            {showFeatures && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-dark-200 dark:to-dark-300 border border-gray-200 dark:border-dark-400 rounded-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-dark-base dark:text-white mb-2">
                        ✨ Premium Features
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Powerful budgeting tools at your fingertips
                      </p>
                    </div>
                    <button
                      onClick={() => setShowFeatures(false)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-dark-400 rounded-button transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Feature 1 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-400 rounded-button p-4 hover:border-primary-500/50 hover:scale-105 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-button bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Wallet className="w-6 h-6 text-primary-500" />
                      </div>
                      <h3 className="font-bold text-dark-base dark:text-white mb-2">
                        💼 Create Category Budgets
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Set monthly/weekly budgets per category (Food, Rent, Transport) and track spend vs limit.
                      </p>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-400 rounded-button p-4 hover:border-green-500/50 hover:scale-105 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-button bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-6 h-6 text-green-500" />
                      </div>
                      <h3 className="font-bold text-dark-base dark:text-white mb-2">
                        📊 Budget vs Spend Chart
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Visualize progress with an easy bar/area chart and % used.
                      </p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-400 rounded-button p-4 hover:border-yellow-500/50 hover:scale-105 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-button bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Bell className="w-6 h-6 text-yellow-500" />
                      </div>
                      <h3 className="font-bold text-dark-base dark:text-white mb-2">
                        🔔 Smart Alerts & Thresholds
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get notifications at 50% / 80% / 100% of budget and custom thresholds.
                      </p>
                    </motion.div>

                    {/* Feature 4 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-400 rounded-button p-4 hover:border-blue-500/50 hover:scale-105 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-button bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-blue-500" />
                      </div>
                      <h3 className="font-bold text-dark-base dark:text-white mb-2">
                        🎯 Savings Goals & Targets
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create goals (e.g., "₹5,000 Vacation") and track progress toward them.
                      </p>
                    </motion.div>

                    {/* Feature 5 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-400 rounded-button p-4 hover:border-purple-500/50 hover:scale-105 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-button bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <RefreshCw className="w-6 h-6 text-purple-500" />
                      </div>
                      <h3 className="font-bold text-dark-base dark:text-white mb-2">
                        ♻️ Rollover & Carryover
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Unspent budget can roll over to the next period or be locked.
                      </p>
                    </motion.div>

                    {/* Feature 6 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-400 rounded-button p-4 hover:border-pink-500/50 hover:scale-105 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-button bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-pink-500" />
                      </div>
                      <h3 className="font-bold text-dark-base dark:text-white mb-2">
                        👥 Shared Budgets & Groups
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create group budgets, invite members, and split contributions automatically.
                      </p>
                    </motion.div>

                    {/* Feature 7 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-400 rounded-button p-4 hover:border-teal-500/50 hover:scale-105 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-button bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6 text-teal-500" />
                      </div>
                      <h3 className="font-bold text-dark-base dark:text-white mb-2">
                        🔁 Recurring Budgets & Auto-adjust
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Auto-create monthly budgets and suggest adjustments based on past spend.
                      </p>
                    </motion.div>

                    {/* Feature 8 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-400 rounded-button p-4 hover:border-orange-500/50 hover:scale-105 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-button bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Download className="w-6 h-6 text-orange-500" />
                      </div>
                      <h3 className="font-bold text-dark-base dark:text-white mb-2">
                        📥 Export & History
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Export budget reports (CSV/PDF) and view historical trends by period.
                      </p>
                    </motion.div>
                  </div>

                  <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-button">
                    <p className="text-sm text-primary-700 dark:text-primary-300 text-center">
                      <Zap className="w-4 h-4 inline mr-2" />
                      All features are actively being developed and will be available soon!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Coming Soon Card */}
          <div className="card text-center">
            <div className="text-6xl mb-6">🤝</div>
            <h2 className="text-2xl font-bold text-dark-base dark:text-white mb-4">
              Group Features Coming Soon!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Split expenses with friends, track group spending, and settle
              bills automatically.
            </p>

            {/* Features Preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[
                {
                  icon: Users,
                  title: "Create Groups",
                  desc: "Organize expenses by groups",
                },
                {
                  icon: UserPlus,
                  title: "Add Members",
                  desc: "Invite friends to join groups",
                },
                {
                  icon: Calculator,
                  title: "Smart Splitting",
                  desc: "Equal, custom, or percentage splits",
                },
                {
                  icon: CreditCard,
                  title: "Auto Settlement",
                  desc: "Calculate who owes what",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="p-4 bg-gray-50 dark:bg-dark-200 rounded-button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Icon className="mx-auto mb-2 text-accent-500" size={24} />
                    <h3 className="font-semibold text-dark-base dark:text-white text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {feature.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Mock Group */}
            <div className="mt-8 p-6 bg-gradient-to-r from-accent-100 to-primary-100 dark:from-accent-900/20 dark:to-primary-900/20 rounded-card">
              <h3 className="text-lg font-bold text-dark-base dark:text-white mb-4">
                🎬 Preview: Movie Night Squad
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🍿</span>
                    <div className="text-left">
                      <p className="font-medium text-dark-base dark:text-white">
                        Movie Tickets
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Split among 4 friends
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-dark-base dark:text-white">
                    ₹1,200
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🍕</span>
                    <div className="text-left">
                      <p className="font-medium text-dark-base dark:text-white">
                        Pizza & Snacks
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You paid, others owe
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-dark-base dark:text-white">
                    ₹800
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-dark-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-dark-base dark:text-white">
                      Your share:
                    </span>
                    <span className="font-bold text-green-600">₹500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-dark-base dark:text-white">
                      Others owe you:
                    </span>
                    <span className="font-bold text-primary-500">₹300</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Groups;
