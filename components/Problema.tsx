import { problema } from "@/content/site-copy";

export default function Problema() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-2xl font-bold text-primary sm:text-3xl">
        {problema.titulo}
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {problema.puntos.map((punto, i) => (
          <div key={i} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-celeste">
              {i + 1}
            </div>
            <h3 className="font-semibold text-gray-900">{punto.titulo}</h3>
            <p className="mt-2 text-sm text-gray-600">{punto.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
