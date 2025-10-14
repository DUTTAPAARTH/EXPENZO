import React from "react";
import { motion } from "framer-motion";
import { User, Settings, Shield, Bell } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-cream-500 dark:bg-dark-base">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-dark-base dark:text-white mb-2">
              ⚙️ Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account and preferences
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="card text-center">
            <div className="text-6xl mb-6">👤</div>
            <h2 className="text-2xl font-bold text-dark-base dark:text-white mb-4">
              Profile Management Coming Soon!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Customize your profile, set budgets, and manage your account
              settings.
            </p>

            {/* Features Preview */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {[
                {
                  icon: User,
                  title: "Personal Info",
                  desc: "Update name, avatar, and details",
                },
                {
                  icon: Settings,
                  title: "Preferences",
                  desc: "Customize app behavior",
                },
                {
                  icon: Shield,
                  title: "Security",
                  desc: "Password and account security",
                },
                {
                  icon: Bell,
                  title: "Notifications",
                  desc: "Manage alerts and reminders",
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
