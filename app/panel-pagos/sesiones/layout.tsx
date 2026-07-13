import { Suspense } from "react";

export default function SesionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Cargando...</div>}>{children}</Suspense>;
}
