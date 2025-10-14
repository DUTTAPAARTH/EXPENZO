import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Brain, PieChart } from "lucide-react";

const Insights = () => {
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
              📊 Spending Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered analysis of your spending patterns
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="card text-center">
            <div className="text-6xl mb-6">🤖</div>
            <h2 className="text-2xl font-bold text-dark-base dark:text-white mb-4">
              AI Insights Coming Soon!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get personalized insights about your spending habits with our
              AI-powered analytics.
            </p>

            {/* Features Preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[
                {
                  icon: Brain,
                  title: "AI Analysis",
                  desc: "Smart spending pattern recognition",
                },
                {
                  icon: TrendingUp,
                  title: "Trend Forecasting",
                  desc: "Predict future spending trends",
                },
                {
                  icon: PieChart,
                  title: "Category Insights",
                  desc: "Deep dive into spending categories",
                },
                {
                  icon: BarChart3,
                  title: "Visual Reports",
                  desc: "Beautiful charts and graphs",
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
                    <Icon
                      className="mx-auto mb-2 text-secondary-500"
                      size={24}
                    />
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

            {/* Mock Insights */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-card">
              <h3 className="text-lg font-bold text-dark-base dark:text-white mb-4">
                🎯 Sneak Peek: Your Insights
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">☕</span>
                  <div>
                    <p className="font-medium text-dark-base dark:text-white">
                      Coffee Lover Alert!
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You've spent 15% more on coffee this month. That's 12
                      premium coffees! ☕
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">📈</span>
                  <div>
                    <p className="font-medium text-dark-base dark:text-white">
                      Smart Saver
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your spending is 8% lower than last month. Keep up the
                      great work!
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">🎭</span>
                  <div>
                    <p className="font-medium text-dark-base dark:text-white">
                      Entertainment Enthusiast
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Friday nights are your peak entertainment spending time.
                    </p>
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

export default Insights;
