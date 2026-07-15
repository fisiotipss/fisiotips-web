"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthData {
  email: string;
  role: string;
}

interface Registro {
  id: string;
  email: string;
  fecha: string;
  paciente: string;
  tipo: string;
  hora_desde?: string;
  hora_hasta?: string;
  observaciones?: string;
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
  id: string;
  nombre: string;
  apellido: string;
  lesion: string;
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
  const [tab, setTab] = useState<"atenciones" | "pagos" | "usuarios" | "pacientes" | "cargar-paciente">("atenciones");
  const [changePassModal, setChangePassModal] = useState<{ email: string; nombre: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [editModal, setEditModal] = useState<Usuario | null>(null);

  // Pacientes form
  const [newPaciente, setNewPaciente] = useState({ nombre: "", apellido: "", lesion: "", sesiones: 10 });
  const [loadingPaciente, setLoadingPaciente] = useState(false);

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
        cargarDatos();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSaveUsuario = async () => {
    if (!editModal) return;
    try {
      const res = await fetch("/api/panel-pagos/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editModal),
      });
      if (res.ok) {
        alert("Usuario actualizado correctamente");
        setEditModal(null);
        cargarDatos();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAgregarPaciente = async () => {
    if (!newPaciente.nombre.trim() || !newPaciente.apellido.trim()) {
      alert("Nombre y apellido requeridos");
      return;
    }

    setLoadingPaciente(true);
    try {
      const res = await fetch("/api/panel-pagos/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: newPaciente.nombre,
          apellido: newPaciente.apellido,
          lesion: newPaciente.lesion || "General",
          sesiones_compradas: newPaciente.sesiones,
          sesiones_disponibles: newPaciente.sesiones,
        }),
      });

      if (res.ok) {
        alert("Paciente agregado correctamente");
        setNewPaciente({ nombre: "", apellido: "", lesion: "", sesiones: 10 });
        cargarDatos();
      } else {
        alert("Error al agregar paciente");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al agregar paciente");
    } finally {
      setLoadingPaciente(false);
    }
  };

  const getNombreUsuario = (email: string) => {
    return usuarios.find((u) => u.email === email)?.nombre || email;
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "clinica":
        return "Clínica Shangrila/Lagomar";
      case "domicilio_a":
        return "Domicilio A";
      case "domicilio_b":
        return "Domicilio B";
      default:
        return tipo;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">ReActive Admin</h1>
            <p className="text-sm text-gray-600">Control de atenciones y pagos</p>
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
        <div className="mb-6 flex gap-2 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setTab("atenciones")}
            className={`pb-3 px-4 font-medium text-sm transition whitespace-nowrap ${
              tab === "atenciones"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📋 Atenciones
          </button>
          <button
            onClick={() => setTab("pagos")}
            className={`pb-3 px-4 font-medium text-sm transition whitespace-nowrap ${
              tab === "pagos"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            💰 Pagos
          </button>
          <button
            onClick={() => setTab("usuarios")}
            className={`pb-3 px-4 font-medium text-sm transition whitespace-nowrap ${
              tab === "usuarios"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => setTab("pacientes")}
            className={`pb-3 px-4 font-medium text-sm transition whitespace-nowrap ${
              tab === "pacientes"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🏥 Pacientes
          </button>
          <button
            onClick={() => setTab("cargar-paciente")}
            className={`pb-3 px-4 font-medium text-sm transition whitespace-nowrap ${
              tab === "cargar-paciente"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            ➕ Agregar Paciente
          </button>
        </div>

        {tab === "atenciones" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#0f5c4d]">
                Atenciones registradas
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
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Usuario</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Fecha</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Ubicación</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Paciente</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Horario</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-gray-600">
                        No hay atenciones registradas para este mes
                      </td>
                    </tr>
                  ) : (
                    registros.map((reg) => (
                      <tr key={reg.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-semibold text-[#0f5c4d]">
                          {getNombreUsuario(reg.email)}
                        </td>
                        <td className="p-3">{reg.fecha}</td>
                        <td className="p-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              reg.tipo === "clinica"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {getTipoLabel(reg.tipo)}
                          </span>
                        </td>
                        <td className="p-3">{reg.paciente}</td>
                        <td className="p-3 text-xs text-gray-600">
                          {reg.hora_desde && reg.hora_hasta
                            ? `${reg.hora_desde} - ${reg.hora_hasta}`
                            : "-"}
                        </td>
                        <td className="p-3 text-xs text-gray-600 max-w-[150px] truncate">
                          {reg.observaciones || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "pagos" && (
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
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Nombre</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Tipo</th>
                    <th className="text-center p-3 text-[#0f5c4d] font-semibold">Clínica</th>
                    <th className="text-center p-3 text-[#0f5c4d] font-semibold">Domicilio</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Total</th>
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
                      <td className="p-3 text-center space-x-2 flex justify-center">
                        <button
                          onClick={() => setEditModal(u)}
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:opacity-90"
                        >
                          ✏️ Editar
                        </button>
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

        {tab === "pacientes" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">Pacientes en Sistema</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-[#eef4f6]">
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Paciente</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Lesión</th>
                    <th className="text-center p-3 text-[#0f5c4d] font-semibold">Compradas</th>
                    <th className="text-center p-3 text-[#0f5c4d] font-semibold">Disponibles</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((p) => (
                    <tr key={p.id || p.nombre} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-semibold text-[#0f5c4d]">
                        {p.nombre} {p.apellido}
                      </td>
                      <td className="p-3">{p.lesion}</td>
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
                        {p.sesiones_disponibles === 1 && " ⚠"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "cargar-paciente" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
            <h2 className="text-lg font-bold text-[#0f5c4d] mb-6">Agregar Paciente</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newPaciente.nombre}
                  onChange={(e) => setNewPaciente({ ...newPaciente, nombre: e.target.value })}
                  placeholder="Ej: Juan"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={newPaciente.apellido}
                  onChange={(e) => setNewPaciente({ ...newPaciente, apellido: e.target.value })}
                  placeholder="Ej: Pérez"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Lesión / Motivo
                </label>
                <input
                  type="text"
                  value={newPaciente.lesion}
                  onChange={(e) => setNewPaciente({ ...newPaciente, lesion: e.target.value })}
                  placeholder="Ej: Esguince de tobillo"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Sesiones a Cargar
                </label>
                <input
                  type="number"
                  value={newPaciente.sesiones}
                  onChange={(e) => setNewPaciente({ ...newPaciente, sesiones: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
              <button
                onClick={handleAgregarPaciente}
                disabled={loadingPaciente}
                className="w-full bg-[#2563eb] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {loadingPaciente ? "Agregando..." : "Agregar Paciente"}
              </button>
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

      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
            <h3 className="text-lg font-bold text-[#0f5c4d] mb-4">Editar Usuario: {editModal.nombre}</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">Email</label>
                <input
                  type="email"
                  value={editModal.email}
                  onChange={(e) => setEditModal({ ...editModal, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">Nombre</label>
                <input
                  type="text"
                  value={editModal.nombre}
                  onChange={(e) => setEditModal({ ...editModal, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={editModal.telefono || ""}
                  onChange={(e) => setEditModal({ ...editModal, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">Banco</label>
                <input
                  type="text"
                  value={editModal.banco || ""}
                  onChange={(e) => setEditModal({ ...editModal, banco: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">Número de Cuenta</label>
                <input
                  type="text"
                  value={editModal.nro_cuenta || ""}
                  onChange={(e) => setEditModal({ ...editModal, nro_cuenta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">Sucursal (opcional)</label>
                <input
                  type="text"
                  value={editModal.sucursal || ""}
                  onChange={(e) => setEditModal({ ...editModal, sucursal: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveUsuario}
                className="flex-1 bg-green-500 text-white font-medium py-2 rounded-md hover:opacity-90"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setEditModal(null)}
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
