import type { Config } from "tailwindcss";

export default {
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
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgb(37 99 235 / 0.1), 0 4px 6px -4px rgb(37 99 235 / 0.1)',
        'xl': '0 20px 25px -5px rgb(37 99 235 / 0.2), 0 8px 10px -6px rgb(37 99 235 / 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
