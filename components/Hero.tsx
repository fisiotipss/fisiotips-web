import { hero } from "@/content/site-copy";
import WhatsAppButton from "./WhatsAppButton";
import SafeImage from "./SafeImage";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section id="top" className="bg-primary-light">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
        <Reveal>
          <h1 className="text-3xl font-extrabold leading-tight text-primary sm:text-4xl md:text-5xl">
            {hero.titulo}
          </h1>
          <p className="mt-5 text-lg text-gray-700">{hero.subtitulo}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#consulta"
              className="inline-flex items-center justify-center rounded-full bg-celeste px-6 py-3 text-sm font-semibold text-white transition-colors hover:brightness-90"
            >
              {hero.ctaPrimario}
            </a>
            <WhatsAppButton texto={hero.ctaSecundario} variant="outline" />
          </div>
        </Reveal>

        <Reveal
          delay={150}
          className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg"
        >
          <SafeImage
            src={hero.fotoSrc}
            alt="Joaquín Cazenave, fisioterapeuta"
            className="h-full w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
