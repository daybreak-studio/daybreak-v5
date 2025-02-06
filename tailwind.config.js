/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
      // Remove border-border if it's not being used
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [
    // Add nth-child variants for column selection
    function ({ addVariant }) {
      addVariant("nth-2", "&:nth-child(2)");
      addVariant("nth-3", "&:nth-child(3)");
    },
  ],
};
