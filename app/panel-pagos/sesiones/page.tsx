"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Registro {
  id: string;
  fecha: string;
  paciente: string;
  tipo: string;
  clinica: string | null;
  domicilio: string | null;
  hora_desde: string | null;
  hora_hasta: string | null;
  observaciones: string | null;
}

interface AuthData {
  email: string;
  role: string;
  name: string;
}

export default function MisSesiones() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data) {
      router.push("/panel-pagos");
    } else {
      const authData = JSON.parse(data);
      setAuth(authData);
    }
  }, [router]);

  useEffect(() => {
    if (auth) {
      cargarSesiones();
    }
  }, [mes, auth]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (auth) cargarSesiones();
    }, 2000);
    return () => clearInterval(interval);
  }, [auth]);

  const cargarSesiones = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/panel-pagos/registros?email=${auth?.email}&mes=${mes}`
      );
      if (res.ok) {
        const { data } = await res.json();
        setRegistros(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("panelAuth");
    router.push("/panel-pagos");
  };

  if (!auth) return null;

  const mesesDisponibles = [
    "2026-06",
    "2026-07",
    "2026-08",
    "2026-09",
    "2026-10",
    "2026-11",
    "2026-12",
  ];

  const getNombreMes = (mesStr: string) => {
    const [year, month] = mesStr.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
      "es-ES",
      { month: "long", year: "numeric" }
    );
  };

  const getTipoLabel = (tipo: string) => {
    if (tipo === "clinica") return "Clínica";
    if (tipo === "domicilio_a") return "Domicilio A";
    if (tipo === "domicilio_b") return "Domicilio B";
    return tipo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f5c4d]">
              ReActive
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">Mis sesiones</p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/panel-pagos/perfil"
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
            >
              ← Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
              Mes
            </label>
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
            >
              {mesesDisponibles.map((m) => (
                <option key={m} value={m}>
                  {getNombreMes(m)}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-600">
              Cargando sesiones...
            </div>
          ) : registros.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No hay sesiones registradas para este mes
            </div>
          ) : (
            <div className="space-y-4">
              {registros.map((registro) => (
                <div
                  key={registro.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Fecha</p>
                      <p className="text-sm font-semibold text-[#0f5c4d]">
                        {new Date(registro.fecha).toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Paciente
                      </p>
                      <p className="text-sm font-semibold">
                        {registro.paciente}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Tipo</p>
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {getTipoLabel(registro.tipo)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Horario
                      </p>
                      <p className="text-sm">
                        {registro.hora_desde && registro.hora_hasta
                          ? `${registro.hora_desde} - ${registro.hora_hasta}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                  {registro.observaciones && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Observaciones:
                      </p>
                      <p className="text-sm text-gray-700">
                        {registro.observaciones}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
            <p>
              Total sesiones ({getNombreMes(mes)}):
              <strong className="ml-2">{registros.length}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
