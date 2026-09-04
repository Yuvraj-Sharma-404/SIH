import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans'", "sans-serif"],
        serif: ["'Noto Serif'", "'Merriweather'", "serif"],
        noto: ["'Noto Sans'", "sans-serif"],
        inter: ["'Inter'", "sans-serif"],
        source: ["'Source Sans 3'", "sans-serif"],
        "source-sans": ["'Source Sans 3'", "sans-serif"],
        ibm: ["'IBM Plex Sans'", "sans-serif"],
        "ibm-plex": ["'IBM Plex Sans'", "sans-serif"],
        roboto: ["'Roboto'", "sans-serif"],
        open: ["'Open Sans'", "sans-serif"],
        "open-sans": ["'Open Sans'", "sans-serif"],
        lato: ["'Lato'", "sans-serif"],
        notoserif: ["'Noto Serif'", "serif"],
        "noto-serif": ["'Noto Serif'", "serif"],
        merriweather: ["'Merriweather'", "serif"],
        public: ["'Public Sans'", "sans-serif"],
        "public-sans": ["'Public Sans'", "sans-serif"],
        devanagari: ["'Noto Sans Devanagari'", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gov: {
          navy: "#0B3B60",
          "navy-dark": "#06243D",
          blue: "#1E3A8A",
          saffron: "#E65100",
          "saffron-light": "#FFF7ED",
          emerald: "#059669",
          "emerald-light": "#F0FDF4",
        },
      },
    },
  },
  plugins: [],
};

export default config;
