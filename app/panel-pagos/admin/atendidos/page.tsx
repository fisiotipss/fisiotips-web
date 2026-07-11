"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PacientesAtendidos() {
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [mes, setMes] = useState("2026-06");
  const [filtro, setFiltro] = useState("");
  const [registros, setRegistros] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data) {
      router.push("/panel-pagos");
      return;
    }
    const auth = JSON.parse(data);
    if (auth.role !== "admin") {
      router.push("/panel-pagos");
      return;
    }
    setAuth(auth);
  }, [router]);

  useEffect(() => {
    if (!auth) return;
    fetch("/api/panel-pagos/usuarios").then(r => r.json()).then(d => {
      setUsuarios((d.data || []).filter((u: any) => u.rol !== "admin"));
    });
  }, [auth]);

  useEffect(() => {
    if (!auth) return;
    let url = `/api/panel-pagos/registros?mes=${mes}`;
    if (filtro) url += `&email=${filtro}`;
    fetch(url).then(r => r.json()).then(d => setRegistros(d.data || []));
  }, [mes, filtro, auth]);

  useEffect(() => {
    if (!auth) return;
    const i = setInterval(() => {
      fetch("/api/panel-pagos/usuarios").then(r => r.json()).then(d => {
        setUsuarios((d.data || []).filter((u: any) => u.rol !== "admin"));
      });
      let url = `/api/panel-pagos/registros?mes=${mes}`;
      if (filtro) url += `&email=${filtro}`;
      fetch(url).then(r => r.json()).then(d => setRegistros(d.data || []));
    }, 2000);
    return () => clearInterval(i);
  }, [auth, mes, filtro]);

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
            <Link href="/panel-pagos/admin" className="text-sm text-gray-600">← Atrás</Link>
            <button onClick={() => { localStorage.removeItem("panelAuth"); router.push("/panel-pagos"); }} className="text-sm text-gray-600">Cerrar</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0f5c4d] mb-2">Mes</label>
            <select value={mes} onChange={e => setMes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="2026-06">junio 2026</option>
              <option value="2026-07">julio 2026</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0f5c4d] mb-2">Usuarios: {usuarios.length}</label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
              <button onClick={() => setFiltro("")} className={`px-3 py-1 rounded text-sm ${filtro === "" ? "bg-[#0f5c4d] text-white" : "bg-gray-300"}`}>Todos</button>
              {usuarios.map(u => (
                <button key={u.email} onClick={() => setFiltro(u.email)} className={`px-3 py-1 rounded text-sm ${filtro === u.email ? "bg-[#0f5c4d] text-white" : "bg-gray-300"}`}>
                  {u.nombre}
                </button>
              ))}
            </div>
          </div>

          {registros.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No hay registros</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-[#0f5c4d]">Fecha</th>
                    <th className="px-4 py-3 text-left text-[#0f5c4d]">Paciente</th>
                    <th className="px-4 py-3 text-left text-[#0f5c4d]">Usuario</th>
                    <th className="px-4 py-3 text-left text-[#0f5c4d]">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map(r => (
                    <tr key={r.id} className="border-b">
                      <td className="px-4 py-3">{r.fecha}</td>
                      <td className="px-4 py-3">{r.paciente}</td>
                      <td className="px-4 py-3 text-xs bg-blue-50 rounded px-2 py-1">{r.email}</td>
                      <td className="px-4 py-3 text-xs bg-gray-100 rounded px-2">{r.tipo === "clinica" ? "Clínica" : "Domicilio"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-sm text-gray-600">Total: {registros.length}</p>
        </div>
      </div>
    </div>
  );
}
