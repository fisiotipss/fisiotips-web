import "../globals.css";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      {children}
    </div>
  );
}
