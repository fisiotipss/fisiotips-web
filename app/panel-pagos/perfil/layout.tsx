import { Suspense } from "react";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Cargando...</div>}>{children}</Suspense>;
}
