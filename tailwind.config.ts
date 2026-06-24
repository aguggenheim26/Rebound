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
        // Warm & hopeful palette for Rebound
        blush: {
          50:  "#FFF5F5",
          100: "#FFE8E8",
          200: "#FFCECE",
          300: "#FFAAAA",
          400: "#FF7B7B",
          500: "#F95F5F",
          600: "#E63E3E",
          700: "#C42B2B",
          800: "#A32626",
          900: "#872525",
        },
        peach: {
          50:  "#FFF8F3",
          100: "#FFEEDD",
          200: "#FFDABB",
          300: "#FFC08A",
          400: "#FF9E57",
          500: "#FF7E2F",
          600: "#F06014",
          700: "#C74A0E",
          800: "#9E3C13",
          900: "#7F3313",
        },
        rose: {
          50:  "#FFF0F5",
          100: "#FFE0EC",
          200: "#FFC0D9",
          300: "#FF91BB",
          400: "#FF5594",
          500: "#FF2070",
          600: "#F0005C",
          700: "#CC0050",
          800: "#A80044",
          900: "#8C003B",
        },
        warm: {
          50:  "#FFFAF7",
          100: "#FFF3EC",
          200: "#FFE4D0",
          300: "#FFD0AD",
          400: "#FFB380",
          500: "#FF9655",
          600: "#F07030",
          700: "#CC5520",
          800: "#A84018",
          900: "#8C3314",
        },
        sand: {
          50:  "#FDFAF7",
          100: "#FAF4EC",
          200: "#F2E6D4",
          300: "#E8D2B4",
          400: "#D9B88A",
          500: "#C89D63",
          600: "#AA7E45",
          700: "#8A6335",
          800: "#6F4F2A",
          900: "#5C4023",
        },
        cream: "#FDF8F4",
        "off-white": "#FAF6F2",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "warm-sm": "0 2px 8px rgba(249, 95, 95, 0.08)",
        "warm-md": "0 4px 20px rgba(249, 95, 95, 0.12)",
        "warm-lg": "0 8px 40px rgba(249, 95, 95, 0.16)",
        "card": "0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
      },
      animation: {
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "bounce-soft": "bounceSoft 0.6s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
