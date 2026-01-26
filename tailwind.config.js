const Colors = require("./constants/colors").default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Required for NativeWind v4
  darkMode: "class",
  content: [
    "./App.js",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: Colors.primary50,
          100: Colors.primary100,
          200: Colors.primary200,
          300: Colors.primary300,
          400: Colors.primary400,
          500: Colors.primary500,
          600: Colors.primary600,
          700: Colors.primary700,
          800: Colors.primary800,
        },
        // Accent colors
        accent: {
          50: Colors.accent50,
          100: Colors.accent100,
          200: Colors.accent200,
          300: Colors.accent300,
          400: Colors.accent400,
          500: Colors.accent500,
          600: Colors.accent600,
          700: Colors.accent700,
          800: Colors.accent800,
        },
        // Gray colors
        gray: {
          50: Colors.gray50,
          100: Colors.gray100,
          200: Colors.gray200,
          300: Colors.gray300,
          400: Colors.gray400,
          500: Colors.gray500,
          600: Colors.gray600,
          700: Colors.gray700,
          800: Colors.gray800,
        },
        // Success colors
        success: {
          50: Colors.success50,
          100: Colors.success100,
          200: Colors.success200,
          300: Colors.success300,
          400: Colors.success400,
          500: Colors.success500,
          600: Colors.success600,
          700: Colors.success700,
          800: Colors.success800,
        },
        // Error colors
        error: {
          50: Colors.error50,
          100: Colors.error100,
          200: Colors.error200,
          300: Colors.error300,
          400: Colors.error400,
          500: Colors.error500,
          600: Colors.error600,
          700: Colors.error700,
          800: Colors.error800,
        },
        // Specific UI colors
        textPrimary: Colors.textPrimary,
        textSecondary: Colors.textSecondary,
        textTertiary: Colors.textTertiary,
        textLight: Colors.textLight,
        background: Colors.background,
        card: Colors.card,
        border: Colors.border,
        icon: Colors.icon,
        matchHigh: Colors.matchHigh,
        matchMedium: Colors.matchMedium,
        matchLow: Colors.matchLow,
        highPriority: Colors.highPriority,
        mediumPriority: Colors.mediumPriority,
      },
    },
  },
  plugins: [],
};
