import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Bell,
  Moon,
  Globe,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Trash2,
} from "lucide-react";

const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    weeklyReports: false,
    billReminders: true,
  });

  const [darkMode, setDarkMode] = useState(true);

  const settingSections = [
    {
      id: "profile",
      title: "Profile Settings",
      icon: User,
      fields: [
        {
          label: "Full Name",
          type: "text",
          value: "John Doe",
          icon: User,
        },
        {
          label: "Email Address",
          type: "email",
          value: "john.doe@example.com",
          icon: Mail,
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      fields: [
        {
          label: "Current Password",
          type: "password",
          placeholder: "Enter current password",
          icon: Lock,
        },
        {
          label: "New Password",
          type: "password",
          placeholder: "Enter new password",
          icon: Lock,
        },
        {
          label: "Confirm Password",
          type: "password",
          placeholder: "Confirm new password",
          icon: Lock,
        },
      ],
    },
  ];

  const currencies = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState("INR");

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      {/* Profile & Security Settings */}
      {settingSections.map((section, sectionIndex) => {
        const SectionIcon = section.icon;
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <SectionIcon className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {section.title}
              </h2>
            </div>

            <div className="space-y-4">
              {section.fields.map((field, fieldIndex) => {
                const FieldIcon = field.icon;
                return (
                  <div key={fieldIndex}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <FieldIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={
                          field.type === "password" && showPassword
                            ? "text"
                            : field.type
                        }
                        defaultValue={field.value}
                        placeholder={field.placeholder}
                        className="w-full pl-12 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                      />
                      {field.type === "password" && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {section.id === "security" && (
              <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            )}

            {section.id === "profile" && (
              <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}
          </motion.div>
        );
      })}

      {/* Currency Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-secondary-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Currency & Region
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Preferred Currency
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.name} ({currency.code})
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-accent-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              label: "Email Notifications",
              description: "Receive email updates about your account",
            },
            {
              key: "budgetAlerts",
              label: "Budget Alerts",
              description: "Get notified when approaching budget limits",
            },
            {
              key: "weeklyReports",
              label: "Weekly Reports",
              description: "Receive weekly spending summary",
            },
            {
              key: "billReminders",
              label: "Bill Reminders",
              description: "Reminders for upcoming bills",
            },
          ].map((notification) => (
            <div
              key={notification.key}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="font-medium text-white">{notification.label}</p>
                <p className="text-sm text-slate-400">
                  {notification.description}
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle(notification.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications[notification.key]
                    ? "bg-primary-600"
                    : "bg-slate-700"
                }`}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  animate={{
                    left: notifications[notification.key] ? "28px" : "4px",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Moon className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Appearance</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Dark Mode</p>
            <p className="text-sm text-slate-400">
              Use dark theme across the app
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-primary-600" : "bg-slate-700"
            }`}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full"
              animate={{
                left: darkMode ? "28px" : "4px",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-slate-900 border border-red-900/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-t border-slate-800">
            <div>
              <p className="font-medium text-white">Log Out</p>
              <p className="text-sm text-slate-400">
                Sign out from your account
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-slate-800">
            <div>
              <p className="font-medium text-red-400">Delete Account</p>
              <p className="text-sm text-slate-400">
                Permanently delete your account and all data
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
