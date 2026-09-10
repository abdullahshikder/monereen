import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/page-builder/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF8F5",
        sand: "#E8E4DD",
        stone: "#C4BEB5",
        charcoal: "#2D2D2D",
        accent: {
          DEFAULT: "#C45D3E",
          light: "#D4785C",
          dark: "#A04A30",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "hero": ["6rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
      },
      spacing: {
        "section-sm": "4rem",
        "section-md": "6rem",
        "section-lg": "8rem",
        "section-xl": "10rem",
      },
    },
  },
  plugins: [],
};

export default config;
