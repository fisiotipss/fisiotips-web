"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Sesion {
  id: string;
  fecha: string;
  paciente: string;
  tipo: string;
  hora_desde?: string;
  hora_hasta?: string;
  observaciones?: string;
}

export default function SesionesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    if (email) {
      cargarSesiones();
    }
  }, [email, mes]);

  useEffect(() => {
    if (!email) return;
    const interval = setInterval(() => {
      cargarSesiones();
    }, 2000);
    return () => clearInterval(interval);
  }, [email, mes]);

  const cargarSesiones = async () => {
    try {
      const res = await fetch(
        `/api/panel-pagos/registros?email=${email}&mes=${mes}`
      );
      const data = await res.json();
      setSesiones(data.data || []);
    } catch (error) {
      console.error("Error cargando sesiones:", error);
    } finally {
      setLoading(false);
    }
  };

  const tipoLabel = (tipo: string) => {
    return tipo === "clinica" ? "Clínica" : "Domicilio";
  };

  const calcularMonto = (tipo: string) => {
    const rol = JSON.parse(localStorage.getItem("panelAuth") || "{}").role;
    if (rol === "Socio") {
      return 350;
    }
    if (tipo === "clinica") {
      return 250;
    }
    return 700;
  };

  const stats = {
    total: sesiones.length,
    clinica: sesiones.filter((s) => s.tipo === "clinica").length,
    domicilio: sesiones.filter((s) => s.tipo !== "clinica").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">ReActive</h1>
            <p className="text-sm text-gray-600">Historial de sesiones</p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Atrás
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-[#0f5c4d]">
              Sesiones realizadas
            </h2>
            <input
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total },
              { label: "Clínica", value: stats.clinica },
              { label: "Domicilio", value: stats.domicilio },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-[#eef4f6] to-[#f5f9fb] rounded-lg p-4 text-center border border-gray-200"
              >
                <p className="text-xs text-gray-600 mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-[#0f5c4d]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-gray-600 py-8">Cargando...</p>
          ) : sesiones.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No hay sesiones registradas para este mes
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-[#eef4f6]">
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">
                      Fecha
                    </th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">
                      Paciente
                    </th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">
                      Ubicación
                    </th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">
                      Horario
                    </th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">
                      Monto
                    </th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sesiones.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">{s.fecha}</td>
                      <td className="p-3">{s.paciente}</td>
                      <td className="p-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            s.tipo === "clinica"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {tipoLabel(s.tipo)}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-600">
                        {s.hora_desde && s.hora_hasta
                          ? `${s.hora_desde} - ${s.hora_hasta}`
                          : "-"}
                      </td>
                      <td className="p-3 font-semibold text-[#0f5c4d]">
                        ${calcularMonto(s.tipo)}
                      </td>
                      <td className="p-3 text-xs text-gray-600 truncate">
                        {s.observaciones || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
