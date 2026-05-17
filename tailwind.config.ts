import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050812",
        ocean: "#071427",
        cyanGlow: "#3fe7ff",
        iris: "#8267ff",
        mint: "#5af3c7",
        roseGlow: "#ff5876"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 48px rgba(63, 231, 255, 0.22)",
        soft: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "aurora-grid":
          "radial-gradient(circle at 20% 10%, rgba(63,231,255,.16), transparent 28%), radial-gradient(circle at 82% 16%, rgba(130,103,255,.18), transparent 30%), linear-gradient(135deg, #050812 0%, #071427 48%, #02040a 100%)"
      }
    }
  },
  plugins: []
};

export default config;
