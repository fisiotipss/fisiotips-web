"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  email: string;
  role: string;
}

const mockData = [
  {
    nombre: "Ariel Martínez",
    tipo: "Fisio",
    horas: 32,
    detalles: "28h × $250 = $7,000 | 4h × $450 = $1,800",
    total: 8800,
    estado: "Pendiente",
  },
  {
    nombre: "Ivonne Rodríguez",
    tipo: "Fisio",
    horas: 28,
    detalles: "28h × $250 = $7,000 | 4 dom × $700 = $2,800",
    total: 9800,
    estado: "Pagado",
  },
  {
    nombre: "Carlos López",
    tipo: "Socio",
    horas: 24,
    detalles: "24h × $350 = $8,400 (sin límite)",
    total: 8400,
    estado: "Pagado",
  },
  {
    nombre: "Sandra García",
    tipo: "Socio",
    horas: 20,
    detalles: "20h × $350 = $7,000",
    total: 7000,
    estado: "Pendiente",
  },
];

const sessionData = [
  { paciente: "Juan García", compradas: 10, realizadas: 8, disponibles: 2 },
  { paciente: "Ivonne López", compradas: 6, realizadas: 6, disponibles: 0 },
  { paciente: "Ariel Sánchez", compradas: 15, realizadas: 11, disponibles: 4 },
  { paciente: "María Ruiz", compradas: 8, realizadas: 5, disponibles: 3 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data || JSON.parse(data).role !== "admin") {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("panelAuth");
    router.push("/panel-pagos");
  };

  if (!auth) return null;

  const totalPagar = mockData.reduce((sum, item) => sum + item.total, 0);

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
              + Nuevo usuario
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
            { label: "Sesiones", value: "127" },
            { label: "Horas clínica", value: "94h" },
            { label: "Domicilios", value: "33" },
            { label: "Personal", value: "4" },
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
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">
            Cálculo de pagos por personal
          </h2>
          <div className="mb-4 p-3 bg-[#eef4f6] border-l-3 border-[#0f5c4d] text-sm text-[#0f5c4d]">
            Fisios: $250/paciente (3+ en la misma hora = $450/h) | Socios: $350/paciente
            (fijo) | Domicilio A: +$700 | Domicilio B: +$1000
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
                  <th className="text-left p-3 text-[#3b5f7c] font-semibold">
                    Horas
                  </th>
                  <th className="text-left p-3 text-[#3b5f7c] font-semibold">
                    Detalles
                  </th>
                  <th className="text-left p-3 text-[#3b5f7c] font-semibold">
                    Total
                  </th>
                  <th className="text-left p-3 text-[#3b5f7c] font-semibold">
                    Estado
                  </th>
                  <th className="text-left p-3 text-[#3b5f7c] font-semibold">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((item) => (
                  <tr key={item.nombre} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-semibold text-[#0f5c4d]">
                      {item.nombre}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          item.tipo === "Fisio"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{item.horas}h</td>
                    <td className="p-3 text-xs text-gray-600">{item.detalles}</td>
                    <td className="p-3 font-semibold text-[#0f5c4d]">
                      ${item.total.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          item.estado === "Pagado"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.estado}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-xs bg-[#2563eb] text-white px-3 py-1 rounded hover:opacity-90">
                        {item.estado === "Pagado" ? "Comprobante" : "Pagar"}
                      </button>
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
                  <td colSpan={2}></td>
                </tr>
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
                    Realizadas
                  </th>
                  <th className="text-center p-3 text-[#3b5f7c] font-semibold">
                    Disponibles
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessionData.map((item) => (
                  <tr key={item.paciente} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-semibold text-[#0f5c4d]">
                      {item.paciente}
                    </td>
                    <td className="p-3 text-center">{item.compradas}</td>
                    <td className="p-3 text-center">{item.realizadas}</td>
                    <td
                      className={`p-3 text-center font-semibold ${
                        item.disponibles === 0
                          ? "text-red-600"
                          : "text-[#2563eb]"
                      }`}
                    >
                      {item.disponibles}
                      {item.disponibles === 0 && " ⚠"}
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
