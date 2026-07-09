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
  sesionesCompradas: number;
  creado: string;
}

export default function GestionarPacientes() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([
    {
      id: "1",
      nombre: "Juan",
      apellido: "García",
      lesion: "Codo - Tendinitis",
      sesionesCompradas: 10,
      creado: "2026-07-01",
    },
    {
      id: "2",
      nombre: "Ivonne",
      apellido: "López",
      lesion: "Rodilla - Condromalacia",
      sesionesCompradas: 6,
      creado: "2026-07-01",
    },
    {
      id: "3",
      nombre: "Ariel",
      apellido: "Sánchez",
      lesion: "Espalda - Lumbalgia",
      sesionesCompradas: 15,
      creado: "2026-07-02",
    },
    {
      id: "4",
      nombre: "María",
      apellido: "Ruiz",
      lesion: "Cadera - Tendinopatía",
      sesionesCompradas: 8,
      creado: "2026-07-02",
    },
  ]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [lesion, setLesion] = useState("");
  const [sesiones, setSesiones] = useState("10");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data || JSON.parse(data).role !== "admin") {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
    }
  }, [router]);

  const handleAddPaciente = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaciente: Paciente = {
      id: Date.now().toString(),
      nombre,
      apellido,
      lesion,
      sesionesCompradas: parseInt(sesiones),
      creado: new Date().toISOString().split("T")[0],
    };
    setPacientes([...pacientes, newPaciente]);
    setNombre("");
    setApellido("");
    setLesion("");
    setSesiones("10");
    setSuccess(`${nombre} ${apellido} agregado correctamente`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("panelAuth");
    router.push("/panel-pagos");
  };

  if (!auth) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">Gestionar Pacientes</h1>
            <p className="text-sm text-gray-600">Crear y administrar pacientes</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/panel-pagos/admin"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Volver al dashboard
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

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-6">Agregar nuevo paciente</h2>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleAddPaciente} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="García"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Lesión / Patología
              </label>
              <input
                type="text"
                value={lesion}
                onChange={(e) => setLesion(e.target.value)}
                placeholder="Ej: Rodilla - Condromalacia, Espalda - Lumbalgia"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Sesiones compradas
              </label>
              <input
                type="number"
                value={sesiones}
                onChange={(e) => setSesiones(e.target.value)}
                min="1"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f5c4d] text-white font-medium py-2.5 rounded-md hover:opacity-90"
            >
              Agregar paciente
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">Pacientes ({pacientes.length})</h2>
          <div className="space-y-3">
            {pacientes.map((paciente) => (
              <div
                key={paciente.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <p className="font-semibold text-[#0f5c4d]">
                    {paciente.nombre} {paciente.apellido}
                  </p>
                  <p className="text-sm text-gray-600">{paciente.lesion}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {paciente.sesionesCompradas} sesiones • Creado: {paciente.creado}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#2563eb]">
                    {paciente.sesionesCompradas}
                  </div>
                  <p className="text-xs text-gray-500">sesiones</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-900">
          <strong>📌 Nota:</strong> Los pacientes que agregues aquí aparecerán en el formulario de registro de los fisios.
          Ellos podrán seleccionar de esta lista al registrar una sesión.
        </div>
      </div>
    </div>
  );
}
