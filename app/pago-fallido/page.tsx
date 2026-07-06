import Link from "next/link";
import { marca } from "@/content/site-copy";

export default function PagoFallido() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-red-700">El pago no se pudo completar</h1>
      <p className="mt-4 text-gray-600">
        Tus datos de la evaluación ya los recibimos igual. Si el problema persiste, escribinos por
        WhatsApp y coordinamos el pago de otra forma.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href={marca.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Escribir por WhatsApp
        </a>
        <Link href="/#consulta" className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary">
          Volver a intentar
        </Link>
      </div>
    </main>
  );
}
