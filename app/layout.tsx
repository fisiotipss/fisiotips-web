import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joaquín Cazenave — Fisiotips",
  description:
    "Fisioterapia deportiva especializada en lesiones de miembro inferior. Recuperá la confianza en tus piernas con un proceso activo, personalizado y medible.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
