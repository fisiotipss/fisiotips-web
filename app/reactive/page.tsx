import ReservaForm from "@/components/ReservaForm";

const WHATSAPP = "https://w.app/reactive";
const COMO_LLEGAR = "https://share.google/SMypT8x5LxhKU4H6N";
const INSTAGRAM =
  "https://www.instagram.com/reactive.fisio?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==";

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
    titulo: "Entrenamiento personalizado +35",
    texto: "Readaptación física y entrenamiento a medida para cuerpos que ya tienen historia.",
  },
];

const estudios = [
  { titulo: "Ecografía", texto: "Servicio tercerizado para acelerar tu diagnóstico." },
  { titulo: "Resonancia", texto: "Servicio tercerizado para ver con precisión lo que necesitás." },
  { titulo: "Tomografía", texto: "Servicio tercerizado para decidir el tratamiento sin esperas largas." },
];

function BotonPrincipal({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0b2545] shadow-md transition hover:brightness-95"
    >
      {children}
    </a>
  );
}

export default function ReActivePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b2545] via-[#5b7695] to-white text-[#0b2545]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="/reactive/instalaciones-gym.jpg"
          alt="Espacio de entrenamiento ReActive"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Fisioterapia y entrenamiento</p>
          <h1 className="mt-4 text-5xl font-bold sm:text-6xl">ReActive</h1>
          <p className="mt-3 text-lg italic text-white/80">Donde la ciencia y el movimiento se unen</p>
          <p className="mx-auto mt-8 max-w-2xl text-base text-white/90 sm:text-lg">
            Clínica de rehabilitación traumatológica y entrenamiento personalizado. Te acompañamos
            desde la lesión hasta volver a moverte sin miedo, y después te ayudamos a no volver a lesionarte.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <BotonPrincipal href={WHATSAPP}>Contactar por WhatsApp</BotonPrincipal>
            <BotonPrincipal href={COMO_LLEGAR}>Cómo llegar</BotonPrincipal>
            <BotonPrincipal href={INSTAGRAM}>Instagram</BotonPrincipal>
          </div>
        </div>
      </section>

      {/* Lago y ubicación */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b2545] to-[#3d6a94] shadow-xl">
          <div
            role="img"
            aria-label="Vista al Lago Calcagno desde ReActive"
            className="h-72 w-full bg-cover bg-center sm:h-96"
            style={{ backgroundImage: "url(/reactive/lago.jpg)" }}
          />
          <div className="p-8 text-white sm:p-10">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70">Shangrilá · Frente al lago</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Rehabilitarte frente al Lago Calcagno</h2>
            <p className="mt-4 max-w-2xl text-white/90">
              Un espacio con vista al agua y al verde para entrenar y recuperarte rodeado de naturaleza.
            </p>
            <div className="mt-6">
              <BotonPrincipal href={COMO_LLEGAR}>Ver cómo llegar</BotonPrincipal>
            </div>
          </div>
        </div>
      </section>

      {/* Instalaciones */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Nuestras instalaciones</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <img
              src="/reactive/instalaciones-gym.jpg"
              alt="Zona de entrenamiento"
              className="h-72 w-full object-cover"
            />
            <p className="p-5 text-sm text-[#0b2545]">Zona de entrenamiento funcional y readaptación.</p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <img
              src="/reactive/instalaciones-pasillo.jpg"
              alt="Pasillo de acceso a la clínica"
              className="h-72 w-full object-cover"
            />
            <p className="p-5 text-sm text-[#0b2545]">Acceso a la clínica y a las salas de trabajo.</p>
          </div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-lg sm:p-12">
          <h2 className="text-3xl font-bold text-[#0b2545] sm:text-4xl">Qué hacemos</h2>
          <p className="mt-5 text-lg text-gray-700">
            Rehabilitación traumatológica y entrenamiento personalizado con foco en la readaptación física y en
            la continuidad del proceso. Para personas que pasaron por una lesión, o que quieren entrenar sin
            lesionarse y sin caer en planillas genéricas.
          </p>
        </div>
      </section>

      {/* Estudios tercerizados */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Estudios para acelerar tu proceso</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/85">
          Contamos con servicio tercerizado de ecografía, resonancia y tomografía.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {estudios.map((e) => (
            <div
              key={e.titulo}
              className="rounded-2xl border-2 border-[#0b2545] bg-white p-6 text-center shadow-md"
            >
              <h3 className="text-xl font-bold text-[#0b2545]">{e.titulo}</h3>
              <p className="mt-2 text-sm text-gray-700">{e.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Servicios</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {servicios.map((s, i) => (
            <div key={s.titulo} className="rounded-2xl bg-white p-6 shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b2545] text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-[#0b2545]">{s.titulo}</h3>
              <p className="mt-2 text-sm text-gray-700">{s.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl bg-[#0b2545] p-8 text-white shadow-xl sm:p-12">
          <h2 className="text-3xl font-bold sm:text-4xl">Quiénes somos</h2>
          <p className="mt-5 text-lg text-white/90">
            Somos un equipo de fisioterapeutas especializados en lesiones de miembro inferior, en Montevideo y
            Ciudad de la Costa. Trabajamos con un enfoque activo, personalizado y medible: cada plan se arma
            según tu lesión, tu deporte y tu evolución real.
          </p>
          <p className="mt-5 text-lg text-white/90">
            Muchos piensan que recuperarse es caro. En ReActive venimos a mostrar lo contrario: la rehabilitación
            no tiene que ser un lujo, y lo que más importa es que vuelvas a moverte bien y te quedes en el camino.
          </p>
        </div>
      </section>

      {/* Formulario de evaluación (mismo flujo que Fisiotips) */}
      <div className="bg-white">
        <ReservaForm />
      </div>

      {/* Pie */}
      <footer className="bg-[#0b2545] px-6 py-10 text-center text-white">
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
