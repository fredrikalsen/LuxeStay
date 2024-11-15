/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        primary: "#F5F5F5",
        navbar: "#F0F0F0",
        accent: "#068488",
        card: "#FFFFFF",

        // Text colors
        textPrimary: "#333333",
        textSecondary: "#777777",
        link: "#2C6E90",
        linkHover: "#3A4E83",

        // Button colors
        buttonPrimary: "#222222",
        buttonPrimaryHover: "#444444",
        buttonSecondary: "#DADADA",
        buttonSecondaryHover: "#C1C1C1",
        buttonPrimaryText: "#FFFFFF",
        buttonSecondaryText: "#333333",

        // UI-Elements colors
        icon: "#666666",
        iconHover: "#555555",
        border: "#999999",
        divider: "#CCCCCC",
        success: "#3ABE3C",
        error: "#D32F2F",
        disabled: "#F0F0F0",

        // Input colors
        inputBackground: "#F5F5F5",
        inputBorder: "#CCCCCC",
        inputFocus: "#1A73E8",

        // Favorite colors
        favoriteOutline: "#FFFFFF",
        favoriteActive: "#F4BF3F",
        favoriteInactive: "#CCCCCC",
      },
    },
  },
  plugins: [],
};
