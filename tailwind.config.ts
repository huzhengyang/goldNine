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
        primary: {
          DEFAULT: "#1A5F2A",
          light: "#2D8F47",
          dark: "#0F3A19",
        },
        secondary: {
          DEFAULT: "#D4AF37",
          light: "#E8C868",
          dark: "#B89530",
        },
        text: {
          primary: "#1F1F1F",
          secondary: "#595959",
          tertiary: "#999999",
          disabled: "#CCCCCC",
        },
        bg: {
          primary: "#FFFFFF",
          secondary: "#F5F5F5",
          tertiary: "#FAFAFA",
          disabled: "#F0F0F0",
        },
        border: {
          DEFAULT: "#E8E8E8",
          primary: "#E8E8E8",
          secondary: "#D9D9D9",
        },
        background: "#FFFFFF",
        foreground: "#1F1F1F",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1A5F2A 0%, #2D8F47 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4AF37 0%, #E8C868 100%)",
        "gradient-dark": "linear-gradient(135deg, #0F3A19 0%, #1A5F2A 100%)",
        "gradient-ai": "linear-gradient(135deg, #1890FF 0%, #722ED1 50%, #EB2F96 100%)",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0, 0, 0, 0.06)",
        md: "0 4px 16px rgba(0, 0, 0, 0.1)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.12)",
        hover: "0 12px 32px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
