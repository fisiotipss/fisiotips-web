"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  email: string;
  role: string;
}

interface Registro {
  email: string;
  tipo: string;
}

interface Usuario {
  email: string;
  nombre: string;
  rol: string;
}

interface Paciente {
  nombre: string;
  apellido: string;
  sesiones_compradas: number;
  sesiones_disponibles: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [mes, setMes] = useState("2026-07");

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data || JSON.parse(data).role !== "admin") {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
      cargarDatos();
    }
  }, [router]);

  useEffect(() => {
    if (auth) {
      cargarDatos();
    }
  }, [mes, auth]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (auth) cargarDatos();
    }, 2000);
    return () => clearInterval(interval);
  }, [auth]);

  const cargarDatos = async () => {
    try {
      const [regRes, usuRes, pacRes] = await Promise.all([
        fetch(`/api/panel-pagos/registros?mes=${mes}&allUsers=true`),
        fetch("/api/panel-pagos/usuarios"),
        fetch("/api/panel-pagos/pacientes"),
      ]);

      if (regRes.ok) {
        const { data } = await regRes.json();
        setRegistros(data || []);
      }
      if (usuRes.ok) {
        const { data } = await usuRes.json();
        setUsuarios(data?.filter((u: Usuario) => u.rol !== "admin") || []);
      }
      if (pacRes.ok) {
        const { data } = await pacRes.json();
        setPacientes(data || []);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const calcularPagos = () => {
    const porUsuario = new Map<string, { sesiones: number; domicilios: number }>();

    registros.forEach((reg) => {
      if (!porUsuario.has(reg.email)) {
        porUsuario.set(reg.email, { sesiones: 0, domicilios: 0 });
      }
      const data = porUsuario.get(reg.email)!;
      if (reg.tipo === "clinica") {
        data.sesiones++;
      } else {
        data.domicilios++;
      }
    });

    return Array.from(porUsuario.entries()).map(([email, { sesiones, domicilios }]) => {
      const usuario = usuarios.find((u) => u.email === email);
      const tipo = usuario?.rol === "Socio" ? "Socio" : "Fisio";
      const monto =
        tipo === "Socio"
          ? sesiones * 350 + domicilios * 350
          : sesiones * 250 + domicilios * (domicilios === 1 ? 700 : 1000);

      return {
        email,
        nombre: usuario?.nombre || email,
        tipo,
        sesiones,
        domicilios,
        monto,
      };
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("panelAuth");
    router.push("/panel-pagos");
  };

  if (!auth) return null;

  const pagos = calcularPagos();
  const totalPagar = pagos.reduce((sum, p) => sum + p.monto, 0);
  const totalSesiones = registros.length;
  const domicilios = registros.filter((r) => r.tipo !== "clinica").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">ReActive Admin</h1>
            <p className="text-sm text-gray-600">Dashboard de pagos - Julio 2026</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/panel-pagos/admin/atendidos"
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:opacity-90"
            >
              📊 Atendidos
            </Link>
            <Link
              href="/panel-pagos/admin/pacientes"
              className="px-4 py-2 bg-[#2563eb] text-white text-sm font-medium rounded-md hover:opacity-90"
            >
              📋 Pacientes
            </Link>
            <Link
              href="/panel-pagos/admin/comprobantes"
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:opacity-90"
            >
              📄 Comprobantes
            </Link>
            <Link
              href="/panel-pagos/admin/usuarios"
              className="px-4 py-2 bg-[#0f5c4d] text-white text-sm font-medium rounded-md hover:opacity-90"
            >
              + Usuario
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

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Sesiones", value: totalSesiones.toString() },
            { label: "Clínica", value: (totalSesiones - domicilios).toString() },
            { label: "Domicilios", value: domicilios.toString() },
            { label: "Personal", value: pagos.length.toString() },
          ].map((metric) => (
            <div
              key={metric.label}
              className="bg-white rounded-lg border border-gray-200 p-4 text-center"
            >
              <p className="text-xs text-gray-600 mb-2">{metric.label}</p>
              <p className="text-2xl font-bold text-[#0f5c4d]">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#0f5c4d]">
              Cálculo de pagos por personal
            </h2>
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {["2026-06", "2026-07", "2026-08", "2026-09"].map((m) => (
                <option key={m} value={m}>
                  {new Date(m + "-01").toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-[#eef4f6]">
                  <th className="text-left p-3 text-[#3b5f7c] font-semibold">
                    Nombre
                  </th>
                  <th className="text-left p-3 text-[#3b5f7c] font-semibold">
                    Tipo
                  </th>
                  <th className="text-center p-3 text-[#3b5f7c] font-semibold">
                    Clínica
                  </th>
                  <th className="text-center p-3 text-[#3b5f7c] font-semibold">
                    Domicilio
                  </th>
                  <th className="text-left p-3 text-[#3b5f7c] font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-gray-600">
                      No hay registros para este mes
                    </td>
                  </tr>
                ) : (
                  <>
                    {pagos.map((pago) => (
                      <tr key={pago.email} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-semibold text-[#0f5c4d]">
                          {pago.nombre}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              pago.tipo === "Fisio"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {pago.tipo}
                          </span>
                        </td>
                        <td className="p-3 text-center">{pago.sesiones}</td>
                        <td className="p-3 text-center">{pago.domicilios}</td>
                        <td className="p-3 font-semibold text-[#0f5c4d]">
                          ${pago.monto.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#eef4f6] font-bold border-t-2 border-gray-200">
                      <td colSpan={4} className="p-3 text-right text-[#0f5c4d]">
                        Total mes:
                      </td>
                      <td className="p-3 text-[#0f5c4d]">
                        ${totalPagar.toLocaleString()}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">
            Control de sesiones compradas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-[#eef4f6]">
                  <th className="text-left p-3 text-[#3b5f7c] font-semibold">
                    Paciente
                  </th>
                  <th className="text-center p-3 text-[#3b5f7c] font-semibold">
                    Compradas
                  </th>
                  <th className="text-center p-3 text-[#3b5f7c] font-semibold">
                    Disponibles
                  </th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((p) => (
                  <tr key={p.nombre} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-semibold text-[#0f5c4d]">
                      {p.nombre} {p.apellido}
                    </td>
                    <td className="p-3 text-center">{p.sesiones_compradas}</td>
                    <td
                      className={`p-3 text-center font-semibold ${
                        p.sesiones_disponibles === 0
                          ? "text-red-600"
                          : p.sesiones_disponibles === 1
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {p.sesiones_disponibles}
                      {p.sesiones_disponibles === 0 && " ⚠"}
                      {p.sesiones_disponibles === 1 && " ⚠ (última)"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
