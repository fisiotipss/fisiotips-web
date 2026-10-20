import type { Metadata } from "next";
import ReservaForm from "@/components/ReservaForm";

export const metadata: Metadata = {
  title: "ReActive · Rehabilitación y entrenamiento",
  description:
    "Rehabilitación de lesiones musculoesqueléticas y entrenamiento personalizado para volver a entrenar como antes, con seguridad y confianza.",
};

const WHATSAPP = "https://w.app/reactive";
const COMO_LLEGAR = "https://share.google/SMypT8x5LxhKU4H6N";
const INSTAGRAM =
  "https://www.instagram.com/reactive.fisio?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==";

const menu = [
  { label: "Lago y ubicación", href: "#lago" },
  { label: "Instalaciones", href: "#instalaciones" },
  { label: "Estudios", href: "#estudios" },
  { label: "Servicios", href: "#servicios" },
  { label: "Quiénes somos", href: "#nosotros" },
  { label: "Pedir evaluación", href: "#consulta" },
  { label: "Contactar por WhatsApp", href: WHATSAPP, externo: true },
  { label: "Cómo llegar", href: COMO_LLEGAR, externo: true },
  { label: "Instagram", href: INSTAGRAM, externo: true },
];

const servicios = [
  {
    titulo: "Evaluación de lesión, dolor y limitaciones",
    texto: "Diagnóstico funcional completo para entender qué pasa en tu cuerpo y por qué.",
  },
  {
    titulo: "Fisioterapia neurológica y deportiva",
    texto: "Tratamientos adaptados a tu sistema nervioso, a tu deporte y a tus objetivos.",
  },
  {
    titulo: "Recovery",
    texto: "Masajes y vendajes para recuperarte entre sesiones y cuidar el tejido.",
  },
  {
    titulo: "Entrenamiento personalizado +35 · Readaptación física",
    texto: "Entrenamiento a medida para volver a entrenar como antes, con seguridad y confianza.",
  },
];

const estudios = [
  {
    titulo: "Ecografía",
    texto: "Servicio tercerizado para acelerar tu diagnóstico.",
    foto: "/reactive/estudio-ecografia.png",
  },
  {
    titulo: "Resonancia",
    texto: "Servicio tercerizado para ver con precisión lo que necesitás.",
    foto: "/reactive/estudio-resonancia.png",
  },
  {
    titulo: "Tomografía",
    texto: "Servicio tercerizado para decidir el tratamiento sin esperas largas.",
    foto: "/reactive/estudio-tomografia.png",
  },
];

const instalaciones = [
  { src: "/reactive/gym-banda.jpg", titulo: "Movilidad y fuerza", alt: "Trabajo de movilidad y fuerza con bandas" },
  { src: "/reactive/pared-reactive.jpg", titulo: "Zona de entrenamiento", alt: "Zona de entrenamiento ReActive" },
  { src: "/reactive/puente-reactive.jpg", titulo: "Activación", alt: "Ejercicios de activación" },
  { src: "/reactive/sala-pesas.jpg", titulo: "Sala de trabajo", alt: "Sala de trabajo con pesas" },
];

function BotonPrincipal({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-md border border-[#a88a57] bg-white px-6 py-3 text-sm font-semibold tracking-wide text-[#14213d] transition hover:bg-[#f4f1ec]"
    >
      {children}
    </a>
  );
}

export default function ReActivePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#14213d] via-[#56677f] to-white text-[#14213d]">
      {/* Menú fijo */}
      <header className="sticky top-0 z-30 border-b border-[#a88a57]/40 bg-[#14213d]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 text-white">
          <a href="#inicio" className="text-lg font-semibold tracking-wide">
            ReActive
          </a>
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-md border border-[#a88a57] px-4 py-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
              Menú ▾
            </summary>
            <nav className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg bg-white text-[#14213d] shadow-xl">
              {menu.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  {...(m.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block border-b border-gray-100 px-4 py-3 text-sm hover:bg-[#f4f1ec] last:border-b-0"
                >
                  {m.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </header>

      {/* Hero */}
      <section id="inicio" className="relative overflow-hidden">
        <img
          src="/reactive/instalaciones-gym.jpg"
          alt="Espacio de entrenamiento ReActive"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-20 text-center text-white">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8c7a4]">Rehabilitación y entrenamiento</p>
          <h1 className="mt-4 text-5xl font-semibold text-white sm:text-6xl">ReActive</h1>
          <p className="mt-3 text-lg italic text-white/80">Donde la ciencia y el movimiento se unen</p>
          <p className="mx-auto mt-8 max-w-2xl text-base text-white/90 sm:text-lg">
            Rehabilitación de lesiones musculoesqueléticas y entrenamiento para personas que quieren volver a
            entrenar como antes, con seguridad y confianza.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <BotonPrincipal href={WHATSAPP}>Contactar por WhatsApp</BotonPrincipal>
            <BotonPrincipal href={COMO_LLEGAR}>Cómo llegar</BotonPrincipal>
          </div>
        </div>
      </section>

      {/* Lago y ubicación */}
      <section id="lago" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16">
        <div className="overflow-hidden rounded-2xl bg-[#14213d] shadow-xl">
          <div
            role="img"
            aria-label="Vista al Lago Calcagno desde ReActive"
            className="h-72 w-full bg-cover bg-center sm:h-96"
            style={{ backgroundImage: "url(/reactive/lago-sala.jpg)" }}
          />
          <div className="p-8 text-white sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#d8c7a4]">Shangrilá · Frente al lago</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Rehabilitarte frente al Lago Calcagno</h2>
            <p className="mt-4 max-w-2xl text-white/90">
              Un espacio con vista al agua y al verde, en calma, para recuperarte y entrenar con serenidad.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <img
                src="/reactive/lago-comunal.png"
                alt="Lago Calcagno"
                className="h-48 w-full rounded-xl object-cover"
              />
              <img
                src="/reactive/lago-edificios.webp"
                alt="Vista de los edificios frente al lago"
                className="h-48 w-full rounded-xl object-cover"
              />
            </div>
            <div className="mt-6">
              <BotonPrincipal href={COMO_LLEGAR}>Ver cómo llegar</BotonPrincipal>
            </div>
          </div>
        </div>
      </section>

      {/* Instalaciones */}
      <section id="instalaciones" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16">
        <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">Nuestras instalaciones</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {instalaciones.map((f) => (
            <div key={f.src} className="overflow-hidden rounded-xl border border-[#a88a57]/50 bg-white shadow-md">
              <img src={f.src} alt={f.alt} className="h-64 w-full object-cover" />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-[#14213d]">{f.titulo}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Estudios tercerizados */}
      <section id="estudios" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16">
        <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">Estudios para acelerar tu proceso</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/85">
          Contamos con servicio tercerizado de ecografía, resonancia y tomografía.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {estudios.map((e) => (
            <div key={e.titulo} className="overflow-hidden rounded-xl border border-[#a88a57]/50 bg-white shadow-md">
              <div
                role="img"
                aria-label={e.titulo}
                className="h-48 w-full bg-cover bg-center bg-[#14213d]"
                style={{ backgroundImage: `url(${e.foto})` }}
              />
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-[#14213d]">{e.titulo}</h3>
                <p className="mt-2 text-sm text-gray-700">{e.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16">
        <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">Servicios</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {servicios.map((s, i) => (
            <div key={s.titulo} className="rounded-xl bg-white p-6 shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#a88a57] text-sm font-semibold text-[#14213d]">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[#14213d]">{s.titulo}</h3>
              <p className="mt-2 text-sm text-gray-700">{s.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiénes somos */}
      <section id="nosotros" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-16">
        <div className="rounded-2xl bg-[#14213d] p-8 text-white shadow-xl sm:p-12">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Quiénes somos</h2>
          <p className="mt-5 text-lg text-white/90">
            Somos un equipo de fisioterapeutas especializados en lesiones musculoesqueléticas, en Montevideo y
            Ciudad de la Costa. Trabajamos con un enfoque activo, personalizado y medible: cada plan se arma
            según tu lesión, tu actividad y tu evolución real.
          </p>
          <p className="mt-5 text-lg text-white/90">
            Muchos piensan que recuperarse es caro. En ReActive venimos a mostrar lo contrario: la rehabilitación
            no tiene que ser un lujo al alcance de pocos, y lo que más importa es que vuelvas a moverte con
            confianza y te quedes en el camino.
          </p>
        </div>
      </section>

      {/* Formulario de evaluación (mismo flujo que Fisiotips) */}
      <div className="bg-white">
        <ReservaForm />
      </div>

      {/* Pie */}
      <footer className="bg-[#14213d] px-6 py-10 text-center text-white">
        <p className="text-lg font-semibold">ReActive</p>
        <p className="mt-1 text-sm text-white/70">Donde la ciencia y el movimiento se unen</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a>
          <a href={COMO_LLEGAR} target="_blank" rel="noopener noreferrer" className="underline">Cómo llegar</a>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="underline">Instagram</a>
        </div>
      </footer>
    </main>
  );
}
