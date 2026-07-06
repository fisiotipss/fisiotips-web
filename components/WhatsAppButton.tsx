import { marca } from "@/content/site-copy";

export default function WhatsAppButton({
  texto = "Hablar por WhatsApp",
  variant = "solid",
}: {
  texto?: string;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors";
  const styles =
    variant === "solid"
      ? "bg-celeste text-white hover:brightness-90"
      : "border border-celeste text-celeste hover:bg-primary-light";

  return (
    <a
      href={marca.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles}`}
    >
      {texto}
    </a>
  );
}
