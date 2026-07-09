import { marca } from "@/content/site-copy";
import WhatsAppButton from "./WhatsAppButton";
import LogoMark from "./LogoMark";

const links = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#proceso", label: "Proceso" },
  { href: "#videos", label: "Casos de éxito" },
  { href: "#faq", label: "Preguntas" },
  { href: "#consulta", label: "Reservar evaluación" },
];

const adminLinks = [
  { href: "/panel-pagos", label: "Acceso usuario", className: "text-xs bg-[#2563eb] text-white px-3 py-1.5 rounded hover:opacity-90" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" variant="light" />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold uppercase tracking-wide text-[#1b2b36]">
              {marca.slogan}
            </span>
            <span className="text-[8px] uppercase tracking-normal text-[#3b5f7c]/80">
              {marca.nombre}
            </span>
          </span>
        </a>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-celeste"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <a href="/panel-pagos" className="text-xs text-gray-900 hover:text-gray-600 font-medium">
            Acceso usuario
          </a>
          <WhatsAppButton texto="WhatsApp" />
        </div>
      </div>
    </header>
  );
}
