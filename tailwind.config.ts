import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0b12",
        card: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",
        accent: "#6d8bff",
      },
      keyframes: {
        beat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
      },
      animation: {
        beat: "beat var(--beat-duration, 600ms) ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
