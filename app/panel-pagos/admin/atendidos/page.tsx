"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const USUARIOS_HARDCODED = [
  { email: "martuvz@gmail.com", nombre: "Martina", rol: "Fisio" },
  { email: "fisioigalvilla@gmail.com", nombre: "Igal Villa", rol: "Socio" },
  { email: "manu.lara.01@gmail.com", nombre: "Manuela", rol: "Fisio" },
];

export default function PacientesAtendidos() {
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [usuarios, setUsuarios] = useState(USUARIOS_HARDCODED);
  const [mes, setMes] = useState("2026-06");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data) {
      router.push("/panel-pagos");
      return;
    }
    const authData = JSON.parse(data);
    if (authData.role !== "admin") {
      router.push("/panel-pagos");
      return;
    }
    setAuth(authData);
  }, [router]);

  useEffect(() => {
    if (!auth) return;
    fetch("/api/panel-pagos/usuarios")
      .then(r => r.json())
      .then(d => {
        const noAdmin = (d.data || []).filter(u => u.rol !== "admin");
        setUsuarios(noAdmin);
      });
  }, [auth]);

  useEffect(() => {
    if (!auth) return;
    let url = `/api/panel-pagos/registros?mes=${mes}`;
    if (filtroUsuario) url += `&email=${filtroUsuario}`;
    fetch(url).then(r => r.json()).then(d => setRegistros(d.data || []));
  }, [mes, filtroUsuario, auth]);

  useEffect(() => {
    if (!auth) return;
    const interval = setInterval(() => {
      fetch("/api/panel-pagos/usuarios")
        .then(r => r.json())
        .then(d => setUsuarios((d.data || []).filter(u => u.rol !== "admin")));
      let url = `/api/panel-pagos/registros?mes=${mes}`;
      if (filtroUsuario) url += `&email=${filtroUsuario}`;
      fetch(url).then(r => r.json()).then(d => setRegistros(d.data || []));
    }, 2000);
    return () => clearInterval(interval);
  }, [auth, mes, filtroUsuario]);

  if (!auth) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">ReActive</h1>
            <p className="text-sm text-gray-600">Pacientes atendidos</p>
          </div>
          <div className="flex gap-3">
            <Link href="/panel-pagos/admin" className="text-sm text-gray-600 hover:text-gray-900">
              ← Atrás
            </Link>
            <button onClick={() => { localStorage.removeItem("panelAuth"); router.push("/panel-pagos"); }} className="text-sm text-gray-600 hover:text-gray-900">
              Cerrar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-red-100 border border-red-300 p-4 mb-4 rounded text-red-700 text-sm">
          DEBUG: usuarios.length={usuarios.length} | usuarios={JSON.stringify(usuarios.map(u => u.nombre))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">Mes</label>
              <select value={mes} onChange={(e) => setMes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="2026-06">junio de 2026</option>
                <option value="2026-07">julio de 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">Filtrar por usuario ({usuarios.length})</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltroUsuario("")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    filtroUsuario === "" ? "bg-[#0f5c4d] text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Todos
                </button>
                {usuarios.map((u) => (
                  <button
                    key={u.email}
                    onClick={() => setFiltroUsuario(u.email)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      filtroUsuario === u.email ? "bg-[#0f5c4d] text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {u.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {registros.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No hay registros</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr><th className="px-4 py-3 text-left text-[#0f5c4d]">Fecha</th><th className="px-4 py-3 text-left text-[#0f5c4d]">Paciente</th><th className="px-4 py-3 text-left text-[#0f5c4d]">Usuario</th></tr>
              </thead>
              <tbody>
                {registros.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="px-4 py-3">{r.fecha}</td>
                    <td className="px-4 py-3">{r.paciente}</td>
                    <td className="px-4 py-3">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="mt-4 text-sm text-gray-600">Total: {registros.length}</p>
        </div>
      </div>
    </div>
  );
}
