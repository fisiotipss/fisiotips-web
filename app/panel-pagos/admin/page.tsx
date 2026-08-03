"use client";

import React, { useState, useEffect } from "react";
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
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
  const [tab, setTab] = useState<"atenciones" | "pagos" | "usuarios" | "pacientes" | "cargar-paciente" | "cargar-usuario">("atenciones");
  const [changePassModal, setChangePassModal] = useState<{ email: string; nombre: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [editModal, setEditModal] = useState<Usuario | null>(null);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [eliminando, setEliminando] = useState(false);

  // Pacientes form
  const [newPaciente, setNewPaciente] = useState({ nombre: "", apellido: "", lesion: "", tipo: "clinica", sesiones: 10 });
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  // Usuarios form
  const [newUsuario, setNewUsuario] = useState({ email: "", nombre: "", rol: "Fisio", password: "", telefono: "", banco: "", nro_cuenta: "", sucursal: "" });
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

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
          tipo: newPaciente.tipo,
          sesiones_compradas: newPaciente.sesiones,
          sesiones_disponibles: newPaciente.sesiones,
        }),
      });

      if (res.ok) {
        alert("Paciente agregado correctamente");
        setNewPaciente({ nombre: "", apellido: "", lesion: "", tipo: "clinica", sesiones: 10 });
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

  const handleAgregarUsuario = async () => {
    if (!newUsuario.email.trim() || !newUsuario.nombre.trim() || !newUsuario.password.trim()) {
      alert("Email, nombre y contraseña requeridos");
      return;
    }

    setLoadingUsuario(true);
    try {
      const res = await fetch("/api/panel-pagos/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUsuario.email,
          nombre: newUsuario.nombre,
          rol: newUsuario.rol,
          password: newUsuario.password,
        }),
      });

      if (res.ok) {
        alert("Usuario agregado correctamente");
        setNewUsuario({ email: "", nombre: "", rol: "Fisio", password: "", telefono: "", banco: "", nro_cuenta: "", sucursal: "" });
        cargarDatos();
      } else {
        alert("Error al agregar usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al agregar usuario");
    } finally {
      setLoadingUsuario(false);
    }
  };

  const getNombreUsuario = (email: string) => {
    return usuarios.find((u) => u.email === email)?.nombre || email;
  };

  const registrosFiltrados = pacienteSeleccionado
    ? registros.filter((r) => r.paciente === pacienteSeleccionado)
    : registros;

  const obtenerResumenPaciente = () => {
    if (!pacienteSeleccionado || registrosFiltrados.length === 0) return null;
    const sesiones = registrosFiltrados.length;
    const usuariosUnicos = new Set(registrosFiltrados.map((r) => r.email));
    const ultimaFecha = registrosFiltrados[0].fecha;
    const sesionesporUsuario = Array.from(usuariosUnicos).map((email) => {
      const count = registrosFiltrados.filter((r) => r.email === email).length;
      return { email, nombre: getNombreUsuario(email), count };
    });

    return { sesiones, ultimaFecha, sesionesporUsuario };
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

  const agruparHora = (horaDesde: string): string => {
    if (!horaDesde) return "";
    const [horas, minutos] = horaDesde.split(":").map(Number);
    const minInt = minutos || 0;
    const horaAgrupada = minInt >= 40 ? horas + 1 : horas;
    return `${String(horaAgrupada).padStart(2, "0")}:00`;
  };

  const calcularPagos = () => {
    const registrosMes = registros.filter((r) => r.fecha.startsWith(mes));
    const detallesPorUsuario = new Map<string, Array<{ fecha: string; hora: string; pacientes: number; precio: number }>>();

    registrosMes.forEach((reg) => {
      if (!detallesPorUsuario.has(reg.email)) {
        detallesPorUsuario.set(reg.email, []);
      }
    });

    detallesPorUsuario.forEach((_, email) => {
      const regsDelUsuario = registrosMes.filter((r) => r.email === email);
      const usuario = usuarios.find((u) => u.email === email);
      const esSocio = usuario?.rol === "Socio";
      const porFechaHora = new Map<string, Registro[]>();

      regsDelUsuario.forEach((reg) => {
        let key = "";
        if (reg.tipo === "clinica" && reg.hora_desde) {
          const horaAg = agruparHora(reg.hora_desde);
          key = `${reg.fecha}|clinica|${horaAg}`;
        } else if (reg.tipo === "domicilio_a") {
          key = `${reg.fecha}|domicilio_a`;
        } else if (reg.tipo === "domicilio_b") {
          key = `${reg.fecha}|domicilio_b`;
        }

        if (!porFechaHora.has(key)) {
          porFechaHora.set(key, []);
        }
        porFechaHora.get(key)!.push(reg);
      });

      const detalles: Array<{ fecha: string; hora: string; pacientes: number; precio: number }> = [];

      porFechaHora.forEach((regsEnHora, key) => {
        const [fecha, ...resto] = key.split("|");
        const cantPacientes = regsEnHora.length;
        let precio = 0;
        let hora = "";

        if (resto[0] === "clinica") {
          hora = resto[1];
          if (esSocio) {
            precio = cantPacientes * 350;
          } else {
            if (cantPacientes >= 3) precio = 550;
            else if (cantPacientes === 2) precio = 500;
            else precio = 250;
          }
        } else if (resto[0] === "domicilio_a") {
          hora = "Domicilio A";
          precio = esSocio ? cantPacientes * 350 : 700;
        } else if (resto[0] === "domicilio_b") {
          hora = "Domicilio B";
          precio = esSocio ? cantPacientes * 350 : 1000;
        }

        detalles.push({ fecha, hora, pacientes: cantPacientes, precio });
      });

      detallesPorUsuario.set(email, detalles);
    });

    return Array.from(detallesPorUsuario.entries()).map(([email, detalles]) => {
      const usuario = usuarios.find((u) => u.email === email);
      const tipo = usuario?.rol === "Socio" ? "Socio" : "Fisio";
      const monto = detalles.reduce((sum, d) => sum + d.precio, 0);

      return {
        email,
        nombre: usuario?.nombre || email,
        tipo,
        monto,
        detalles,
      };
    });
  };

  const handleToggleCheck = (id: string) => {
    const nuevo = new Set(seleccionados);
    if (nuevo.has(id)) {
      nuevo.delete(id);
    } else {
      nuevo.add(id);
    }
    setSeleccionados(nuevo);
  };

  const handleEliminarSeleccionados = async () => {
    if (seleccionados.size === 0) {
      alert("Selecciona al menos un registro");
      return;
    }

    if (!confirm(`¿Eliminar ${seleccionados.size} registro(s)?`)) {
      return;
    }

    setEliminando(true);
    try {
      const res = await fetch("/api/panel-pagos/registros-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(seleccionados) }),
      });

      if (res.ok) {
        alert("Registros eliminados correctamente");
        setSeleccionados(new Set());
        cargarDatos();
      } else {
        alert("Error al eliminar registros");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar registros");
    } finally {
      setEliminando(false);
    }
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
          <button
            onClick={() => setTab("cargar-usuario")}
            className={`pb-3 px-4 font-medium text-sm transition whitespace-nowrap ${
              tab === "cargar-usuario"
                ? "text-[#0f5c4d] border-b-2 border-[#0f5c4d]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            ➕ Agregar Usuario
          </button>
        </div>

        {tab === "atenciones" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="flex gap-3">
                <h2 className="text-lg font-bold text-[#0f5c4d]">
                  Atenciones registradas
                </h2>
                {seleccionados.size > 0 && (
                  <button
                    onClick={handleEliminarSeleccionados}
                    disabled={eliminando}
                    className="text-sm bg-red-500 text-white px-3 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
                  >
                    🗑️ Eliminar {seleccionados.size}
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={pacienteSeleccionado}
                  onChange={(e) => setPacienteSeleccionado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Todos los pacientes</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={`${p.nombre} ${p.apellido}`}>
                      {p.nombre} {p.apellido}
                    </option>
                  ))}
                </select>
                <input
                  type="month"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            {pacienteSeleccionado && obtenerResumenPaciente() && (
              <div className="bg-gradient-to-r from-[#0f5c4d] to-[#0a4239] text-white rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs opacity-90">Paciente</p>
                    <p className="text-lg font-bold">{pacienteSeleccionado}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-90">Total sesiones</p>
                    <p className="text-lg font-bold">{obtenerResumenPaciente()?.sesiones || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-90">Última sesión</p>
                    <p className="text-lg font-bold">{obtenerResumenPaciente()?.ultimaFecha || "-"}</p>
                  </div>
                </div>
                {obtenerResumenPaciente()?.sesionesporUsuario && (
                  <div className="mt-4 text-sm">
                    <p className="text-xs opacity-90 mb-2">Sesiones por usuario:</p>
                    <div className="space-y-1">
                      {obtenerResumenPaciente()?.sesionesporUsuario.map((u) => (
                        <span key={u.email} className="inline-block bg-white bg-opacity-20 px-2 py-1 rounded mr-2">
                          {u.nombre}: {u.count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-[#eef4f6]">
                    <th className="text-center p-3 w-8">
                      <input
                        type="checkbox"
                        checked={seleccionados.size === registrosFiltrados.length && registrosFiltrados.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSeleccionados(new Set(registrosFiltrados.map((r) => r.id)));
                          } else {
                            setSeleccionados(new Set());
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Usuario</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Fecha</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Ubicación</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Paciente</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Horario</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-3 text-center text-gray-600">
                        No hay atenciones registradas {pacienteSeleccionado ? `para ${pacienteSeleccionado}` : "para este mes"}
                      </td>
                    </tr>
                  ) : (
                    registrosFiltrados.map((reg) => (
                      <tr key={reg.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={seleccionados.has(reg.id)}
                            onChange={() => handleToggleCheck(reg.id)}
                          />
                        </td>
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
              <input
                type="month"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-[#eef4f6]">
                    <th className="text-center p-3 w-8"></th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Nombre</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Tipo</th>
                    <th className="text-left p-3 text-[#0f5c4d] font-semibold">Total</th>
                    <th className="text-center p-3 text-[#0f5c4d] font-semibold">Detalles</th>
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
                        <React.Fragment key={pago.email}>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3 text-center cursor-pointer" onClick={() => { const n = new Set(expandidos); n.has(pago.email) ? n.delete(pago.email) : n.add(pago.email); setExpandidos(n); }}>
                              {expandidos.has(pago.email) ? "▼" : "▶"}
                            </td>
                            <td className="p-3 font-semibold text-[#0f5c4d]">
                              {pago.nombre}
                            </td>
                            <td className="p-3">
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${pago.tipo === "Fisio" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                                {pago.tipo}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-[#0f5c4d]">
                              ${pago.monto.toLocaleString()}
                            </td>
                            <td className="p-3 text-center">
                              <button onClick={() => { const n = new Set(expandidos); n.has(pago.email) ? n.delete(pago.email) : n.add(pago.email); setExpandidos(n); }} className="text-xs bg-[#0f5c4d] text-white px-2 py-1 rounded hover:opacity-90">
                                Ver detalles
                              </button>
                            </td>
                          </tr>
                          {expandidos.has(pago.email) && (
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <td colSpan={5} className="p-4">
                                <div className="text-sm space-y-1">
                                  <div className="font-semibold text-[#0f5c4d] mb-2">Desglose por hora:</div>
                                  {pago.detalles && pago.detalles.map((d, i) => (
                                    <div key={i} className="flex justify-between bg-white p-2 rounded text-xs border-l-2 border-[#0f5c4d]">
                                      <span>{d.fecha} - {d.hora}</span>
                                      <span>{d.pacientes} paciente{d.pacientes !== 1 ? "s" : ""}</span>
                                      <span className="font-semibold text-[#0f5c4d]">${d.precio.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                      <tr className="bg-[#eef4f6] font-bold border-t-2 border-gray-200">
                        <td colSpan={3} className="p-3 text-right text-[#0f5c4d]">
                          Total mes:
                        </td>
                        <td className="p-3 text-[#0f5c4d]">
                          ${totalPagar.toLocaleString()}
                        </td>
                        <td></td>
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
                  Tipo
                </label>
                <select
                  value={newPaciente.tipo}
                  onChange={(e) => setNewPaciente({ ...newPaciente, tipo: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                >
                  <option value="clinica">Clínica</option>
                  <option value="domicilio">Domicilio</option>
                </select>
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

        {tab === "cargar-usuario" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
            <h2 className="text-lg font-bold text-[#0f5c4d] mb-6">Agregar Usuario</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUsuario.email}
                  onChange={(e) => setNewUsuario({ ...newUsuario, email: e.target.value })}
                  placeholder="ejemplo@email.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newUsuario.nombre}
                  onChange={(e) => setNewUsuario({ ...newUsuario, nombre: e.target.value })}
                  placeholder="Ej: Juan"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Rol
                </label>
                <select
                  value={newUsuario.rol}
                  onChange={(e) => setNewUsuario({ ...newUsuario, rol: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                >
                  <option value="Fisio">Fisio</option>
                  <option value="Socio">Socio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={newUsuario.password}
                  onChange={(e) => setNewUsuario({ ...newUsuario, password: e.target.value })}
                  placeholder="Contraseña segura"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  value={newUsuario.telefono}
                  onChange={(e) => setNewUsuario({ ...newUsuario, telefono: e.target.value })}
                  placeholder="+54 9 1234 5678"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                    Banco (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newUsuario.banco}
                    onChange={(e) => setNewUsuario({ ...newUsuario, banco: e.target.value })}
                    placeholder="Ej: Banco XYZ"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                    Nro. Cuenta (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newUsuario.nro_cuenta}
                    onChange={(e) => setNewUsuario({ ...newUsuario, nro_cuenta: e.target.value })}
                    placeholder="1234567890"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                  />
                </div>
              </div>
              <button
                onClick={handleAgregarUsuario}
                disabled={loadingUsuario}
                className="w-full bg-[#2563eb] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {loadingUsuario ? "Agregando..." : "Agregar Usuario"}
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
