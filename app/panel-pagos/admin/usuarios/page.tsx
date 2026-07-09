"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  role: string;
}

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  password: string;
  creado: string;
}

export default function CrearUsuarios() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      email: "ariel@reactive.com",
      nombre: "Ariel Martínez",
      rol: "Fisio",
      password: "reactive.fisio1",
      creado: "2026-07-01",
    },
    {
      id: "2",
      email: "ivonne@reactive.com",
      nombre: "Ivonne Rodríguez",
      rol: "Fisio",
      password: "reactive.fisio2",
      creado: "2026-07-01",
    },
    {
      id: "3",
      email: "carlos@reactive.com",
      nombre: "Carlos López",
      rol: "Socio",
      password: "reactive.socio1",
      creado: "2026-07-02",
    },
  ]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("fisio");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data || JSON.parse(data).role !== "admin") {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
    }
  }, [router]);

  const proximaPassword = () => {
    const rol_prefix = rol === "fisio" ? "fisio" : "socio";
    const numero = usuarios.filter((u) => u.rol === (rol === "fisio" ? "Fisio" : "Socio")).length + 1;
    return `reactive.${rol_prefix}${numero}`;
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newPassword = proximaPassword();
    const newUser: Usuario = {
      id: Date.now().toString(),
      email,
      nombre,
      rol: rol === "fisio" ? "Fisio" : "Socio",
      password: newPassword,
      creado: new Date().toISOString().split("T")[0],
    };
    setUsuarios([...usuarios, newUser]);
    setNombre("");
    setEmail("");
    setSuccess(`Usuario ${nombre} creado. Contraseña: ${newPassword}`);
    setTimeout(() => setSuccess(""), 5000);
  };

  const copyPassword = (password: string, id: string) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
            <h1 className="text-2xl font-bold text-[#0f5c4d]">Gestionar Usuarios</h1>
            <p className="text-sm text-gray-600">Crear y administrar accesos</p>
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
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-6">
            Crear nuevo usuario
          </h2>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@reactive.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Tipo de usuario
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "fisio", label: "Fisio ($250/paciente)" },
                  { value: "socio", label: "Socio ($350/paciente)" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRol(option.value)}
                    className={`py-2.5 px-3 rounded-md text-sm font-medium transition ${
                      rol === option.value
                        ? "bg-[#2563eb] text-white border-[#2563eb]"
                        : "bg-gray-50 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#eef4f6] rounded border border-gray-300 text-sm text-[#0f5c4d]">
              <strong>Contraseña asignada:</strong> <code>{proximaPassword()}</code>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f5c4d] text-white font-medium py-2.5 rounded-md hover:opacity-90"
            >
              Crear usuario
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">Usuarios creados</h2>
          <div className="space-y-3">
            {usuarios.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-[#0f5c4d]">{user.nombre}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.rol === "Fisio" ? "👤 Fisio" : "👥 Socio"} •{" "}
                    {user.creado}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">
                    {user.password}
                  </code>
                  <button
                    onClick={() => copyPassword(user.password, user.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      copiedId === user.id
                        ? "bg-green-500 text-white"
                        : "bg-[#2563eb] text-white hover:opacity-90"
                    }`}
                  >
                    {copiedId === user.id ? "✓ Copiado" : "Copiar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-900">
          <strong>📌 Cómo usar:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Crea el usuario aquí con su email y rol</li>
            <li>Se genera automáticamente una contraseña (reactive.fisio1, etc.)</li>
            <li>Copia la contraseña y envíasela al fisio/socio por WhatsApp</li>
            <li>Ellos ingresan en /panel-pagos con email + contraseña</li>
            <li>Registran sus pacientes diarios y ven sus resúmenes</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
