import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1320px"
      }
    },
    extend: {
      colors: {
        brand: {
          background: "#f9f6f1",
          foreground: "#111111",
          charcoal: "#1c1c1c",
          champagne: "#d4b16a",
          muted: "#f0ece6"
        }
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      boxShadow: {
        luxe: "0 25px 60px -35px rgba(26, 26, 26, 0.35)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.35)"
      },
      backgroundImage: {
        "grid-gold":
          "linear-gradient(135deg, rgba(212, 177, 106, 0.12) 0%, rgba(249, 246, 241, 0) 60%)",
        "hero-overlay":
          "linear-gradient(180deg, rgba(9, 9, 9, 0.4) 0%, rgba(9,9,9,0.72) 75%, rgba(9,9,9,0.9) 100%)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;