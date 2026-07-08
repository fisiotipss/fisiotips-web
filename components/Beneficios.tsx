import { beneficios } from "@/content/site-copy";
import Reveal from "./Reveal";

export default function Beneficios() {
  return (
    <section className="bg-gradient-to-b from-[#a8c3d1] to-[#d9e8ee]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <h2 className="text-center text-2xl font-bold text-primary sm:text-3xl">
          {beneficios.titulo}
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <h3 className="font-semibold text-red-700">Lo que evitás</h3>
            <ul className="mt-4 space-y-3">
              {beneficios.evitas.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span aria-hidden>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="rounded-2xl border border-primary/20 bg-primary-light p-6">
            <h3 className="font-semibold text-primary">Lo que lográs</h3>
            <ul className="mt-4 space-y-3">
              {beneficios.lograr.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span aria-hidden>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal delay={250} className="mt-10 text-center">
        <a
          href="#consulta"
          className="inline-flex items-center justify-center rounded-full bg-celeste px-6 py-3 text-sm font-semibold text-white transition-colors hover:brightness-90"
        >
          Quiero empezar mi proceso
        </a>
      </Reveal>
      </div>
    </section>
  );
}
