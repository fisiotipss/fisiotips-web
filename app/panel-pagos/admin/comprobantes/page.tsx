"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  role: string;
}

interface Pago {
  id: string;
  nombre: string;
  email: string;
  mes: string;
  monto: number;
  estado: "pendiente" | "enviado";
}

export default function GestionarComprobantes() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([
    {
      id: "1",
      nombre: "Ariel Martínez",
      email: "ariel@reactive.com",
      mes: "Julio 2026",
      monto: 8800,
      estado: "pendiente",
    },
    {
      id: "2",
      nombre: "Ivonne Rodríguez",
      email: "ivonne@reactive.com",
      mes: "Julio 2026",
      monto: 9800,
      estado: "enviado",
    },
  ]);
  const [selectedPago, setSelectedPago] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data || JSON.parse(data).role !== "admin") {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedPago || !file) {
      alert("Selecciona un pago y un archivo");
      return;
    }

    setLoading(true);
    try {
      const pago = pagos.find((p) => p.id === selectedPago);
      if (!pago) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fisioId", selectedPago);
      formData.append("mes", pago.mes);
      formData.append("email", pago.email);

      const uploadRes = await fetch("/api/panel-pagos/comprobantes/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Error al subir archivo");

      // Enviar email
      const emailRes = await fetch("/api/panel-pagos/comprobantes/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pago.email,
          nombre: pago.nombre,
          mes: pago.mes,
          monto: pago.monto,
        }),
      });

      if (emailRes.ok) {
        setPagos(
          pagos.map((p) =>
            p.id === selectedPago ? { ...p, estado: "enviado" } : p
          )
        );
        setSuccess(
          `Comprobante enviado a ${pago.email} correctamente`
        );
        setFile(null);
        setSelectedPago(null);
        setTimeout(() => setSuccess(""), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("panelAuth");
    router.push("/panel-pagos");
  };

  if (!auth) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">
              Enviar Comprobantes
            </h1>
            <p className="text-sm text-gray-600">Subir y enviar comprobantes de pago</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/panel-pagos/admin"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Volver al dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-6">
            Subir comprobante de pago
          </h2>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded">
              ✓ {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Seleccionar fisio/socio con pago pendiente
              </label>
              <select
                value={selectedPago || ""}
                onChange={(e) => setSelectedPago(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
              >
                <option value="">Elegir...</option>
                {pagos
                  .filter((p) => p.estado === "pendiente")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} - ${p.monto.toLocaleString()}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Archivo (PDF o imagen)
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
              {file && (
                <p className="text-xs text-gray-600 mt-2">
                  Archivo: {file.name}
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !selectedPago || !file}
              className="w-full bg-[#0f5c4d] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Subir y enviar"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">Historial</h2>
          <div className="space-y-3">
            {pagos.map((pago) => (
              <div
                key={pago.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200"
              >
                <div>
                  <p className="font-semibold text-[#0f5c4d]">{pago.nombre}</p>
                  <p className="text-sm text-gray-600">{pago.mes}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#0f5c4d]">
                    ${pago.monto.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      pago.estado === "enviado"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {pago.estado === "enviado" ? "✓ Enviado" : "Pendiente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
