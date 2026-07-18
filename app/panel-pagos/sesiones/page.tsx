"use client";

import React, { useState, useEffect } from "react";
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
  const [expandido, setExpandido] = useState(false);

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

  const agruparHora = (horaDesde: string): string => {
    if (!horaDesde) return "";
    const [horas, minutos] = horaDesde.split(":").map(Number);
    const minInt = minutos || 0;
    const horaAgrupada = minInt >= 40 ? horas + 1 : horas;
    return `${String(horaAgrupada).padStart(2, "0")}:00`;
  };

  const calcularDesglose = () => {
    const rol = JSON.parse(localStorage.getItem("panelAuth") || "{}").role;
    const esSocio = rol === "Socio";
    const porFechaHora = new Map<string, Sesion[]>();

    sesiones.forEach((s) => {
      let key = "";
      if (s.tipo === "clinica" && s.hora_desde) {
        const horaAg = agruparHora(s.hora_desde);
        key = `${s.fecha}|clinica|${horaAg}`;
      } else if (s.tipo === "domicilio_a") {
        key = `${s.fecha}|domicilio_a`;
      } else if (s.tipo === "domicilio_b") {
        key = `${s.fecha}|domicilio_b`;
      }

      if (!porFechaHora.has(key)) {
        porFechaHora.set(key, []);
      }
      porFechaHora.get(key)!.push(s);
    });

    const desglose: Array<{ fecha: string; hora: string; pacientes: number; precio: number }> = [];
    let total = 0;

    porFechaHora.forEach((sesList, key) => {
      const [fecha, ...resto] = key.split("|");
      const cantPacientes = sesList.length;
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

      desglose.push({ fecha, hora, pacientes: cantPacientes, precio });
      total += precio;
    });

    return { desglose, total };
  };

  const { desglose, total } = calcularDesglose();

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

          {sesiones.length > 0 && !loading && (
            <div className="bg-gradient-to-br from-[#0f5c4d] to-[#0a4239] rounded-lg p-6 mb-8 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-1">Resumen de ingresos</h3>
                  <p className="text-sm opacity-90">Mes: {new Date(mes + "-01").toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</p>
                </div>
                <button
                  onClick={() => setExpandido(!expandido)}
                  className="text-sm bg-white text-[#0f5c4d] px-3 py-1 rounded hover:opacity-90 font-semibold"
                >
                  {expandido ? "Ocultar detalles" : "Ver detalles"}
                </button>
              </div>

              {expandido && (
                <div className="space-y-2 mt-4 pt-4 border-t border-white border-opacity-30">
                  {desglose.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm bg-white bg-opacity-10 p-2 rounded">
                      <span>{d.fecha} - {d.hora}</span>
                      <span>{d.pacientes} paciente{d.pacientes !== 1 ? "s" : ""}</span>
                      <span className="font-semibold">${d.precio.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-base font-bold mt-4 pt-4 border-t border-white border-opacity-30">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

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
                  {sesiones.map((s) => {
                    let precioFila = 0;
                    const rol = JSON.parse(localStorage.getItem("panelAuth") || "{}").role;
                    const esSocio = rol === "Socio";

                    if (s.tipo === "clinica" && s.hora_desde) {
                      const horaAg = agruparHora(s.hora_desde);
                      const detalle = desglose.find((d) => d.fecha === s.fecha && d.hora === horaAg);
                      precioFila = detalle ? detalle.precio / detalle.pacientes : 250;
                    } else if (s.tipo === "domicilio_a") {
                      precioFila = esSocio ? 350 : 700;
                    } else if (s.tipo === "domicilio_b") {
                      precioFila = esSocio ? 350 : 1000;
                    } else {
                      precioFila = 250;
                    }

                    return (
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
                          ${Math.round(precioFila).toLocaleString()}
                        </td>
                        <td className="p-3 text-xs text-gray-600 truncate">
                          {s.observaciones || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
