/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        voxla: {
          blue: "#1E3A8A",
          blueDark: "#152C6B",
          orange: "#F97316",
          ink: "#0F172A",
          slate: "#1E293B",
          mid: "#64748B",
          lightGrey: "#F8FAFC",
          lightBlue: "#EFF6FF"
        }
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
