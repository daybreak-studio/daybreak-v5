import type { Config } from "tailwindcss";

const MOBILE_WIDTH = 640;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        wide: {
          raw: `(min-width: ${MOBILE_WIDTH}px) and (min-aspect-ratio: 1.2/1)`,
        },
        narrow: {
          raw: `(min-width: ${MOBILE_WIDTH}px) and (max-aspect-ratio: 1.2/1)`,
        },
      },
    },
  },
  safelist: [
    {
      pattern: /(col|row)-start-[1-9]/,
      variants: ["wide", "narrow", "sm", "md", "lg", "xl", "2xl"],
    },
  ],
  plugins: [],
};
export default config;
