import React from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Calculator, CreditCard } from "lucide-react";

const Groups = () => {
  return (
    <div className="min-h-screen bg-cream-500 dark:bg-dark-base">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-dark-base dark:text-white mb-2">
              👥 Group Expenses
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Split bills and track shared expenses with friends
            </p>
          </div>

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
