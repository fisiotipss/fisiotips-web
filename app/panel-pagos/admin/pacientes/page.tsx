"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  role: string;
}

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  lesion: string;
  tipo: string;
  sesiones_compradas: number;
  sesiones_disponibles: number;
  creado: string;
  notas?: string;
}

export default function GestionarPacientes() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  // Force redeploy
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [lesion, setLesion] = useState("");
  const [tipo, setTipo] = useState("clinica");
  const [sesionesCompradas, setSesionesCompradas] = useState("10");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [editando, setEditando] = useState<Paciente | null>(null);
  const [editCompradas, setEditCompradas] = useState("");
  const [editDisponibles, setEditDisponibles] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data || JSON.parse(data).role !== "admin") {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
      cargarPacientes();
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (auth) cargarPacientes();
    }, 2000);
    return () => clearInterval(interval);
  }, [auth]);

  const cargarPacientes = async () => {
    try {
      const res = await fetch("/api/panel-pagos/pacientes");
      if (res.ok) {
        const { data } = await res.json();
        setPacientes(data || []);
      }
    } catch (error) {
      console.error("Error cargando pacientes:", error);
    }
  };

  const handleAddPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/panel-pagos/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          lesion,
          tipo,
          sesiones_compradas: parseInt(sesionesCompradas),
          sesiones_disponibles: parseInt(sesionesCompradas),
        }),
      });

      if (res.ok) {
        setSuccess("✓ Paciente agregado correctamente");
        setNombre("");
        setApellido("");
        setLesion("");
        setTipo("clinica");
        setSesionesCompradas("10");
        cargarPacientes();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarSesiones = (p: Paciente) => {
    setEditando(p);
    setEditCompradas(p.sesiones_compradas.toString());
    setEditDisponibles(p.sesiones_disponibles.toString());
  };

  const handleGuardarEdicion = async () => {
    if (!editando) return;

    try {
      const res = await fetch(`/api/panel-pagos/pacientes?id=${editando.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sesiones_compradas: parseInt(editCompradas),
          sesiones_disponibles: parseInt(editDisponibles),
        }),
      });

      if (res.ok) {
        setSuccess("✓ Sesiones actualizadas");
        setEditando(null);
        cargarPacientes();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este paciente?")) return;

    try {
      const res = await fetch(`/api/panel-pagos/pacientes?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccess("✓ Paciente eliminado");
        cargarPacientes();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("panelAuth");
    router.push("/panel-pagos");
  };

  if (!auth) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">ReActive</h1>
            <p className="text-sm text-gray-600">Gestionar pacientes</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/panel-pagos/admin"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Atrás
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

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
            {success}
          </div>
        )}

        {editando && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h3 className="font-bold text-blue-900">
              Editar sesiones: {editando.nombre} {editando.apellido}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sesiones compradas
                </label>
                <input
                  type="number"
                  value={editCompradas}
                  onChange={(e) => setEditCompradas(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sesiones disponibles
                </label>
                <input
                  type="number"
                  value={editDisponibles}
                  onChange={(e) => setEditDisponibles(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGuardarEdicion}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:opacity-90"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditando(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:opacity-90"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">
            Agregar nuevo paciente
          </h2>

          <form onSubmit={handleAddPaciente} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                Lesión/Motivo
              </label>
              <input
                type="text"
                value={lesion}
                onChange={(e) => setLesion(e.target.value)}
                placeholder="Ej: Tendinitis, Post op LCA"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Tipo
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="clinica">Clínica</option>
                  <option value="domicilio">Domicilio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Sesiones compradas
                </label>
                <input
                  type="number"
                  value={sesionesCompradas}
                  onChange={(e) => setSesionesCompradas(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f5c4d] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Agregando..." : "+ Agregar paciente"}
            </button>
          </form>
        </div>

        {/* Lista de pacientes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">
            Pacientes ({pacientes.length})
          </h2>

          {pacientes.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No hay pacientes registrados
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-[#0f5c4d]">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[#0f5c4d]">
                      Lesión
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[#0f5c4d]">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-[#0f5c4d]">
                      Compradas
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-[#0f5c4d]">
                      Disponibles
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-[#0f5c4d]">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {p.nombre} {p.apellido}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.lesion}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {p.tipo === "clinica" ? "Clínica" : "Domicilio"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {p.sesiones_compradas}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-semibold ${
                            p.sesiones_disponibles === 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {p.sesiones_disponibles}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <button
                          onClick={() => handleEditarSesiones(p)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
