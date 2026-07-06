import { marca } from "@/content/site-copy";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <div className="font-bold text-celeste">{marca.nombre}</div>
        <div className="flex gap-6 text-sm text-gray-600">
          <a href={marca.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-celeste">
            WhatsApp
          </a>
          <a href={marca.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-celeste">
            Instagram
          </a>
          <a href={`mailto:${marca.email}`} className="hover:text-celeste">
            {marca.email}
          </a>
        </div>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} {marca.nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
