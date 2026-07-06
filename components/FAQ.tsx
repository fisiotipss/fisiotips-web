import { faq } from "@/content/site-copy";

export default function FAQ() {
  return (
    <section id="faq" className="bg-primary-light/60 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-primary sm:text-3xl">
          {faq.titulo}
        </h2>

        <div className="mt-8 space-y-3">
          {faq.preguntas.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl bg-white p-5 shadow-sm open:shadow-md"
            >
              <summary className="cursor-pointer list-none font-semibold text-gray-900 marker:content-none">
                <span className="flex items-center justify-between">
                  {item.pregunta}
                  <span className="ml-4 text-celeste transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-600">{item.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
