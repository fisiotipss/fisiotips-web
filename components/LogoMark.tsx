// El símbolo de la marca: una línea recta y precisa (la ciencia) que se transforma
// en una curva fluida (el movimiento) — "donde la ciencia y el movimiento se unen".
export default function LogoMark({
  className = "h-10 w-10",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const scienceColor = variant === "dark" ? "#ffffff" : "#3b5f7c";
  return (
    <svg viewBox="0 0 168 168" className={className} aria-hidden>
      <path
        d="M 26 100 L 78 100"
        fill="none"
        stroke={scienceColor}
        strokeWidth={15}
        strokeLinecap="round"
      />
      <path
        d="M 78 100 C 108 100, 132 96, 142 54"
        fill="none"
        stroke="#2563eb"
        strokeWidth={15}
        strokeLinecap="round"
      />
    </svg>
  );
}
