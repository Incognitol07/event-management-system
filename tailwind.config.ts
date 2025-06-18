import type { Config } from "tailwindcss";

export default {
  darkMode: "media", // Disable class-based dark mode to force light theme
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#d1d5db",
        input: "#d1d5db", 
        ring: "#3b82f6",
        background: "#ffffff",
        foreground: "#1e293b",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",        },
        secondary: {
          DEFAULT: "#f1f5f9",
          foreground: "#1e293b",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#f1f5f9",
          foreground: "#1e293b",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1e293b",        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1e293b",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem", 
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
