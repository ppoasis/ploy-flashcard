import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fdf6ec",
        sand: "#f7ead6",
        clay: "#e8d5bd",
        coral: {
          DEFAULT: "#e8815a",
          dark: "#d96c44",
          light: "#f2a986",
        },
        cocoa: {
          DEFAULT: "#5c4433",
          light: "#8a7360",
        },
        leaf: "#6bab90",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px -12px rgba(92, 68, 51, 0.25)",
        card: "0 4px 16px -6px rgba(92, 68, 51, 0.2)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
        pop: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        shake: "shake 0.4s ease-in-out",
        pop: "pop 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
