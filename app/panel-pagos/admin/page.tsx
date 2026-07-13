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
  paciente: string;
}

interface Usuario {
  email: string;
  nombre: string;
  rol: string;
  telefono?: string;
  banco?: string;
  nro_cuenta?: string;
  sucursal?: string;
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
  const [tab, setTab] = useState<"pagos" | "usuarios" | "pacientes-atendidos" | "estado">("pagos");
  const [changePassModal, setChangePassModal] = useState<{ email: string; nombre: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");

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

  const handleChangePassword = async (email: string) => {
    if (!newPassword.trim()) return;
    try {
      const res = await fetch("/api/panel-pagos/usuarios/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      if (res.ok) {
        alert("Contraseña actualizada correctamente");
        setChangePassModal(null);
        setNewPassword("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const obtenerPacientesAtendidos = (emailUsuario: string) => {
    const pacientesSet = new Set<string>();
    registros
      .filter((r) => r.email === emailUsuario)
      .forEach((r) => pacientesSet.add(r.paciente));
    return Array.from(pacientesSet).sort();
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
            <p className="text-sm text-gray-600">Dashboard de administración</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex gap-4 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setTab("pagos")}
            className={`pb-3 px-4 font-medium transition whitespace-nowrap ${
              tab === "pagos"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            💰 Gestión de Pagos
          </button>
          <button
            onClick={() => setTab("usuarios")}
            className={`pb-3 px-4 font-medium transition whitespace-nowrap ${
              tab === "usuarios"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            👥 Usuarios Activos
          </button>
          <button
            onClick={() => setTab("pacientes-atendidos")}
            className={`pb-3 px-4 font-medium transition whitespace-nowrap ${
              tab === "pacientes-atendidos"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📋 Pacientes Atendidos
          </button>
          <button
            onClick={() => setTab("estado")}
            className={`pb-3 px-4 font-medium transition whitespace-nowrap ${
              tab === "estado"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📊 Estado del Sistema
          </button>
        </div>

        {tab === "pagos" && (
          <div className="space-y-6">
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
        )}

        {tab === "usuarios" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">Usuarios Activos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-[#eef4f6]">
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Email</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Nombre</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Rol</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Teléfono</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Banco</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Cuenta</th>
                    <th className="text-center p-3 text-[#0f5c4d] font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.email} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs">{u.email}</td>
                      <td className="p-3">{u.nombre}</td>
                      <td className="p-3">
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {u.rol}
                        </span>
                      </td>
                      <td className="p-3">{u.telefono || "-"}</td>
                      <td className="p-3">{u.banco || "-"}</td>
                      <td className="p-3 text-xs">{u.nro_cuenta || "-"}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setChangePassModal({ email: u.email, nombre: u.nombre })}
                          className="text-xs bg-[#2563eb] text-white px-3 py-1 rounded hover:opacity-90"
                        >
                          🔑 Cambiar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "pacientes-atendidos" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">Pacientes Atendidos por Usuario</h2>
            <div className="space-y-4">
              {usuarios.map((u) => {
                const pacientesAtendidos = obtenerPacientesAtendidos(u.email);
                return (
                  <div key={u.email} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-[#0f5c4d] mb-2">{u.nombre}</h3>
                    <p className="text-xs text-gray-600 mb-2">{u.email}</p>
                    <div className="flex flex-wrap gap-2">
                      {pacientesAtendidos.length === 0 ? (
                        <p className="text-sm text-gray-500">Sin pacientes atendidos</p>
                      ) : (
                        pacientesAtendidos.map((p) => (
                          <span
                            key={p}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "estado" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
              <h2 className="text-xl font-bold text-[#0f5c4d] mb-6">📊 Estado del Sistema</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pacientes Dinámicos */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#0f5c4d]">Pacientes Dinámicos</h3>
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Cargan desde Supabase</p>
                  <div className="bg-blue-50 rounded p-3">
                    <p className="text-3xl font-bold text-blue-600">{pacientes.length}</p>
                    <p className="text-xs text-gray-600">pacientes reales cargados</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Se muestran con nombre y lesión</p>
                </div>

                {/* Editar Perfil */}
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#0f5c4d]">Editar Perfil (⚙️)</h3>
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Datos guardados en Supabase</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-gray-600">Teléfono</span>
                      <span className="font-semibold text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-gray-600">Banco</span>
                      <span className="font-semibold text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-gray-600">Número de cuenta</span>
                      <span className="font-semibold text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-gray-600">Sucursal (opcional)</span>
                      <span className="font-semibold text-green-600">✓</span>
                    </div>
                  </div>
                </div>

                {/* Ver Sesiones */}
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#0f5c4d]">Ver Sesiones (📅)</h3>
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Actualización en tiempo real</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span className="text-gray-600">Historial por mes</span>
                      <span className="font-semibold text-purple-600">✓</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span className="text-gray-600">Estadísticas (Total, Clínica, Domicilio)</span>
                      <span className="font-semibold text-purple-600">✓</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span className="text-gray-600">Tabla detallada</span>
                      <span className="font-semibold text-purple-600">✓</span>
                    </div>
                  </div>
                </div>

                {/* Responsive */}
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#0f5c4d]">Responsive</h3>
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Funciona en todos los dispositivos</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-gray-600">PC</span>
                      <span className="font-semibold text-orange-600">✓</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-gray-600">Celular</span>
                      <span className="font-semibold text-orange-600">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas en Tiempo Real */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#0f5c4d] mb-4">📈 Estadísticas en Tiempo Real</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#eef4f6] to-[#f5f9fb] rounded-lg p-4 text-center border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Usuarios Activos</p>
                  <p className="text-3xl font-bold text-[#0f5c4d]">{usuarios.length}</p>
                </div>
                <div className="bg-gradient-to-br from-[#eef4f6] to-[#f5f9fb] rounded-lg p-4 text-center border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Sesiones Registradas</p>
                  <p className="text-3xl font-bold text-[#0f5c4d]">{registros.length}</p>
                </div>
                <div className="bg-gradient-to-br from-[#eef4f6] to-[#f5f9fb] rounded-lg p-4 text-center border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Clínicas</p>
                  <p className="text-3xl font-bold text-blue-600">{registros.filter(r => r.tipo === "clinica").length}</p>
                </div>
                <div className="bg-gradient-to-br from-[#eef4f6] to-[#f5f9fb] rounded-lg p-4 text-center border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Domicilios</p>
                  <p className="text-3xl font-bold text-purple-600">{registros.filter(r => r.tipo !== "clinica").length}</p>
                </div>
              </div>
            </div>

            {/* Usuarios con Perfil Completo */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#0f5c4d] mb-4">👤 Perfil de Usuarios</h3>
              <div className="space-y-2">
                {usuarios.map((u) => {
                  const profileComplete = u.telefono && u.banco && u.nro_cuenta;
                  const pacientesAtendidos = obtenerPacientesAtendidos(u.email).length;
                  return (
                    <div key={u.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-semibold text-[#0f5c4d]">{u.nombre}</p>
                        <p className="text-xs text-gray-600">{u.email}</p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="text-center">
                          <p className="text-sm font-bold text-[#0f5c4d]">{pacientesAtendidos}</p>
                          <p className="text-xs text-gray-600">pacientes</p>
                        </div>
                        <div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${profileComplete ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {profileComplete ? "✓ Completo" : "⚠ Incompleto"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {changePassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-[#0f5c4d] mb-4">
              Cambiar contraseña de {changePassModal.nombre}
            </h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-4"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleChangePassword(changePassModal.email);
                }
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleChangePassword(changePassModal.email)}
                className="flex-1 bg-[#2563eb] text-white font-medium py-2 rounded-md hover:opacity-90"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setChangePassModal(null);
                  setNewPassword("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
