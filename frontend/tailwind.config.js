/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // HeisenHack Theme Colors
        primary: {
          50: "#fffbeb",
          100: "#fff3c4",
          200: "#ffe588",
          300: "#ffd23f",
          400: "#ffbd20",
          500: "#FFC300", // Main vibrant yellow
          600: "#d19e00",
          700: "#a67c02",
          800: "#89650a",
          900: "#74530f",
        },
        secondary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#2ECCB0", // Main teal green
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#00AEEF", // Electric blue
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        dark: {
          50: "#18181b",
          100: "#27272a",
          200: "#3f3f46",
          300: "#52525b",
          400: "#71717a",
          500: "#a1a1aa",
          600: "#d4d4d8",
          700: "#e4e4e7",
          800: "#f4f4f5",
          900: "#fafafa",
          base: "#121212", // Matte black
        },
        cream: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#FFF8E7", // Soft cream background
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
      },
      fontFamily: {
        heading: ["Bungee", "Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "Nunito", "system-ui", "sans-serif"],
        display: ["Bungee", "cursive"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      borderRadius: {
        card: "1.5rem",
        button: "1rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 195, 0, 0.3)",
        "teal-glow": "0 0 20px rgba(46, 204, 176, 0.3)",
        card: "0 10px 25px rgba(0, 0, 0, 0.1)",
        float: "0 20px 40px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(255, 195, 0, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(255, 195, 0, 0.6)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      maxHeight: {
        "90vh": "90vh",
      },
    },
  },
  plugins: [],
};
