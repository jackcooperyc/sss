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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          apricot: "#FF7A3D",
          "apricot-bright": "#FF8F52",
          "apricot-dark": "#E85F1C",
          "apricot-soft": "#FFF1E8",
          "apricot-muted": "#FFD9C2",
          charcoal: "#2A2A2A",
          "charcoal-mid": "#3A3A3A",
          "charcoal-light": "#4B4B4B",
          "charcoal-dark": "#1A1A1A",
        },
      },
      backgroundImage: {
        "brand-hero":
          "linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 45%, #3F3F3F 100%)",
        "brand-header":
          "linear-gradient(90deg, #1A1A1A 0%, #2E2E2E 50%, #1A1A1A 100%)",
      },
      boxShadow: {
        apricot: "0 10px 25px -5px rgba(255, 122, 61, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
