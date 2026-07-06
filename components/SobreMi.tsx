import { sobreMi } from "@/content/site-copy";
import WhatsAppButton from "./WhatsAppButton";
import SafeImage from "./SafeImage";

export default function SobreMi() {
  return (
    <section id="sobre-mi" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-primary-light">
          <SafeImage
            src={sobreMi.fotos[0]}
            alt={`Foto de ${sobreMi.titulo}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1 text-sm font-semibold text-celeste">
            <svg viewBox="0 0 30 20" className="h-3.5 w-5 flex-shrink-0 rounded-sm" aria-hidden>
              <rect width="30" height="20" fill="#fff" />
              <rect y="2.22" width="30" height="2.22" fill="#0038A8" />
              <rect y="6.67" width="30" height="2.22" fill="#0038A8" />
              <rect y="11.11" width="30" height="2.22" fill="#0038A8" />
              <rect y="15.56" width="30" height="2.22" fill="#0038A8" />
              <rect width="11" height="11.11" fill="#fff" />
              <circle cx="5.5" cy="5.5" r="3" fill="#FCD116" />
            </svg>
            {sobreMi.badge}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">{sobreMi.titulo}</h2>
          <p className="mt-4 text-gray-700">{sobreMi.texto}</p>
          <div className="mt-6">
            <WhatsAppButton texto="Contame tu caso" />
          </div>
        </div>
      </div>
    </section>
  );
}
