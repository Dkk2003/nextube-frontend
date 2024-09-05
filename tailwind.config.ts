import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        primaryBg: "#333333", // Main Background

        // Font Colors
        fontPrimary: "#EAEAEA", // Primary Font Color
        fontSecondary: "#B3B3B3", // Secondary Font Color
        fontMuted: "#888888", // Muted Font Color

        // Primary Accent Color
        primaryAccent: "#E43E3E", // Primary Accent (Logo Red)

        // Secondary Accent Colors
        secondaryAccent: "#434D56", // Secondary Accent (Dark Gray)

        // Neutral Colors
        neutralLight: "#4D4D4D", // Soft Black for containers, etc.
        neutralDivider: "#666666", // Divider and Border Color

        // Hover and Focus States
        hoverAccent: "#5C5C5C", // Dark Cool Gray for hover effects

        // Error and Success Colors
        errorColor: "#CC3B3B", // Muted Red for errors
        successColor: "#5B825F", // Muted Green for success
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
