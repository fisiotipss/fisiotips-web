import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de marca (según la referencia enviada):
        // verde oscuro para títulos, azul para botones/logo/íconos, y celeste oscuro para fondos oscuros.
        primary: {
          DEFAULT: "#0f5c4d", // verde — títulos y texto destacado
          dark: "#2b4a4a", // celeste oscuro — fondos oscuros
          light: "#eef4f6", // fondo suave neutro para cards/secciones
        },
        celeste: "#2563eb", // azul — botones, logotipo, íconos y links
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
