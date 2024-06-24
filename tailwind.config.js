/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.4s ease",
        fadeInOpacity: "fadeInOpacity 0.4s ease",
        scaleIn: "scaleIn 0.5s cubic-bezier(.55,.01,.12,1.73)",
      },

      // that is actual animation
      keyframes: () => ({
        fadeIn: {
          from: { opacity: 0, transform: "translateX(-20px)" },
        },
        fadeInOpacity: {
          from: { opacity: 0 },
        },
        scaleIn: {
          from: { transform: "scale(0)" },
        },
      }),
    },
  },
  plugins: [],
};
