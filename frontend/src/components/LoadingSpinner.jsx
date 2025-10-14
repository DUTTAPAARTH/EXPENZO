import React from "react";

const LoadingSpinner = ({
  size = "medium",
  color = "primary",
  fullScreen = false,
  text = "Loading...",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
    xlarge: "w-16 h-16",
  };

  const colorClasses = {
    primary: "border-primary-500",
    secondary: "border-secondary-500",
    accent: "border-accent-500",
    white: "border-white",
    gray: "border-gray-500",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-2 border-t-transparent rounded-full animate-spin
        `}
      />
      {text && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream-500 dark:bg-dark-base bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-dark-100 rounded-card p-8 shadow-float">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
