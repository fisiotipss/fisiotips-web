"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  email: string;
  role: string;
  name: string;
}

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  lesion: string;
}

export default function RegistroDiario() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [paciente, setPaciente] = useState("");
  const [tipo, setTipo] = useState("clinica");
  const [horaDesde, setHoraDesde] = useState("08:00");
  const [horaHasta, setHoraHasta] = useState("09:00");
  const [observaciones, setObservaciones] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data) {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
      cargarPacientes();
    }
  }, [router]);

  const cargarPacientes = async () => {
    try {
      const res = await fetch("/api/panel-pagos/pacientes");
      const data = await res.json();
      setPacientes(data.data || []);
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/panel-pagos/registros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: auth?.email,
          fecha,
          paciente,
          tipo,
          horaDesde: tipo === "clinica" ? horaDesde : null,
          horaHasta: tipo === "clinica" ? horaHasta : null,
          observaciones,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setPaciente("");
        setObservaciones("");
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("panelAuth");
    router.push("/panel-pagos");
  };

  if (!auth) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">ReActive</h1>
            <p className="text-sm text-gray-600">Registrar sesiones</p>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center">
            <button
              onClick={() => router.push(`/panel-pagos/perfil?email=${auth?.email}`)}
              className="text-sm px-3 py-2 text-[#0f5c4d] hover:bg-gray-100 rounded-md transition"
            >
              ⚙️ Editar perfil
            </button>
            <button
              onClick={() => router.push(`/panel-pagos/sesiones?email=${auth?.email}`)}
              className="text-sm px-3 py-2 text-[#0f5c4d] hover:bg-gray-100 rounded-md transition"
            >
              📅 Ver sesiones
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cerrar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-[#0f5c4d] mb-6">
            Registrar sesión
          </h2>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded">
              ✓ Paciente registrado correctamente
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                {new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Paciente
              </label>
              <select
                value={paciente}
                onChange={(e) => setPaciente(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                required
              >
                <option value="">Seleccionar paciente...</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={`${p.nombre} ${p.apellido}`}>
                    {p.nombre} {p.apellido} - {p.lesion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-3">
                Tipo de atención
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "clinica", label: "Clínica" },
                  { value: "domicilio-a", label: "Domicilio A" },
                  { value: "domicilio-b", label: "Domicilio B" },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTipo(t.value)}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition ${
                      tipo === t.value
                        ? "bg-[#2563eb] text-white border-[#2563eb]"
                        : "bg-gray-50 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {tipo === "clinica" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                    Desde
                  </label>
                  <input
                    type="time"
                    value={horaDesde}
                    onChange={(e) => setHoraDesde(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                    Hasta
                  </label>
                  <input
                    type="time"
                    value={horaHasta}
                    onChange={(e) => setHoraHasta(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Observaciones (opcional)
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ej: sesión fluida, paciente con dolor nuevo, recomendación aplicada..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50 min-h-[100px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrar sesión"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Puedes registrar múltiples pacientes desde este formulario
          </p>
        </div>
      </div>
    </div>
  );
}
