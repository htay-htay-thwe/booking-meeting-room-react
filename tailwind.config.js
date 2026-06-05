/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 }
        }
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
        "pulse-soft": "pulseSoft 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
