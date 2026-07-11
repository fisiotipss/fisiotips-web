"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Registro {
  id: string;
  email: string;
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

interface Usuario {
  email: string;
  nombre: string;
  rol: string;
}

export default function PacientesAtendidos() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [filtroUsuario, setFiltroUsuario] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data) {
      router.push("/panel-pagos");
    } else {
      const authData = JSON.parse(data);
      if (authData.role !== "admin") {
        router.push("/panel-pagos");
      } else {
        setAuth(authData);
        cargarUsuarios();
      }
    }
  }, [router]);

  useEffect(() => {
    if (auth) {
      cargarRegistros();
    }
  }, [mes, filtroUsuario, auth]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (auth) {
        cargarUsuarios();
        cargarRegistros();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [auth]);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("/api/panel-pagos/usuarios");
      if (res.ok) {
        const { data } = await res.json();
        // Filtrar solo fisios y socios (no admin)
        const usuariosActivos = (data || []).filter(
          (u: any) => u.rol && u.rol.toLowerCase() !== "admin"
        );
        setUsuarios(usuariosActivos);
        console.log("Usuarios cargados:", usuariosActivos);
      } else {
        console.error("Error en respuesta:", res.status);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const cargarRegistros = async () => {
    setLoading(true);
    try {
      let url = `/api/panel-pagos/registros?mes=${mes}&allUsers=true`;
      if (filtroUsuario) {
        url = `/api/panel-pagos/registros?mes=${mes}&email=${filtroUsuario}`;
      }

      const res = await fetch(url);
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

  if (!auth || auth.role !== "admin") return null;

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
            <p className="text-xs sm:text-sm text-gray-600">
              Pacientes atendidos
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/panel-pagos/admin"
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
            >
              ← Atrás
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Mes
              </label>
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              >
                {mesesDisponibles.map((m) => (
                  <option key={m} value={m}>
                    {getNombreMes(m)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Filtrar por usuario
              </label>
              <select
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              >
                <option value="">Todos</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.email} value={usuario.email}>
                    {usuario.nombre} ({usuario.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-600">
              Cargando registros...
            </div>
          ) : registros.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No hay registros para este período
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-300">
                  <tr className="bg-gray-50">
                    <th className="px-3 py-3 text-left font-medium text-[#0f5c4d]">
                      Fecha
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-[#0f5c4d]">
                      Paciente
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-[#0f5c4d]">
                      Usuario
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-[#0f5c4d]">
                      Tipo
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-[#0f5c4d]">
                      Horario
                    </th>
                    <th className="px-3 py-3 text-left font-medium text-[#0f5c4d]">
                      Observaciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((registro) => (
                    <tr
                      key={registro.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-3 py-3">
                        {new Date(registro.fecha).toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </td>
                      <td className="px-3 py-3 font-medium">
                        {registro.paciente}
                      </td>
                      <td className="px-3 py-3 text-xs bg-blue-50 text-blue-700 rounded px-2 py-1 w-fit">
                        {registro.email}
                      </td>
                      <td className="px-3 py-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                          {getTipoLabel(registro.tipo)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-600">
                        {registro.hora_desde && registro.hora_hasta
                          ? `${registro.hora_desde} - ${registro.hora_hasta}`
                          : "-"}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-600 max-w-xs truncate">
                        {registro.observaciones || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
            <p>
              Total registros: <strong>{registros.length}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
