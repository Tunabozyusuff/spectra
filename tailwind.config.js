// tailwind.config.js
import scrollbar from 'tailwind-scrollbar';   // ↙️ eklentiyi import et

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    scrollbar({ nocompatible: true })
  ],
};