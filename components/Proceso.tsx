import { proceso } from "@/content/site-copy";
import Reveal from "./Reveal";

export default function Proceso() {
  return (
    <section id="proceso" className="bg-primary-light/60 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-primary sm:text-3xl">
            {proceso.titulo}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proceso.etapas.map((etapa, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-celeste text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-gray-900">{etapa.titulo}</h3>
                <p className="mt-2 text-sm text-gray-600">{etapa.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
