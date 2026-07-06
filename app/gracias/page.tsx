import Link from "next/link";
import { marca } from "@/content/site-copy";

export default function Gracias() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-primary-dark">¡Gracias! Ya recibimos tu pago</h1>
      <p className="mt-4 text-gray-600">
        Recibimos tu pago y tus datos de la evaluación. Para coordinar el día y el horario,
        escribinos ahora por WhatsApp — {marca.nombre.split(" ")[0]} te va a responder personalmente.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href={marca.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Coordinar horario por WhatsApp
        </a>
        <Link href="/" className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
