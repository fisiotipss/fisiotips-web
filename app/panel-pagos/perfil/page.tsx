"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  email: string;
  role: string;
  name: string;
  telefono?: string;
  banco?: string;
  nroCuenta?: string;
  sucursal?: string;
}

export default function Perfil() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<AuthData>>({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data) {
      router.push("/panel-pagos");
    } else {
      const parsed = JSON.parse(data);
      setAuth(parsed);
      setFormData(parsed);
    }
  }, [router]);

  const handleSave = () => {
    if (!auth) return;
    const updated = { ...auth, ...formData };
    localStorage.setItem("panelAuth", JSON.stringify(updated));
    setAuth(updated);
    setEditando(false);
    setSuccess("Perfil actualizado correctamente");
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
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">Mi Perfil</h1>
            <p className="text-sm text-gray-600">Información personal y datos bancarios</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={auth.role === "admin" ? "/panel-pagos/admin" : "/panel-pagos/registro"}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Volver
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
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
            ✓ {success}
          </div>
        )}

        {auth.role === "admin" ? (
          <Link
            href="/panel-pagos/admin/atendidos"
            className="block bg-gradient-to-r from-[#0f5c4d] to-[#0d4a3f] text-white rounded-lg p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">📊 Pacientes Atendidos</h3>
                <p className="text-sm opacity-90">Ver registro de sesiones por mes</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Link>
        ) : (
          <Link
            href="/panel-pagos/sesiones"
            className="block bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white rounded-lg p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">📋 Mis Sesiones</h3>
                <p className="text-sm opacity-90">Ver tus sesiones registradas por mes</p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Link>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#0f5c4d]">Información Personal</h2>
            <button
              onClick={() => setEditando(!editando)}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                editando
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {editando ? "Cancelar" : "✏️ Editar"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                Nombre
              </label>
              {editando ? (
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm"
                />
              ) : (
                <p className="px-3 py-2.5 bg-gray-50 rounded-md text-sm text-gray-700">
                  {auth.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                Email
              </label>
              {editando ? (
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm"
                />
              ) : (
                <p className="px-3 py-2.5 bg-gray-50 rounded-md text-sm text-gray-700">
                  {auth.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                Teléfono
              </label>
              {editando ? (
                <input
                  type="tel"
                  value={formData.telefono || ""}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+598 99 123 456"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm"
                />
              ) : (
                <p className="px-3 py-2.5 bg-gray-50 rounded-md text-sm text-gray-700">
                  {auth.telefono || "No agregado"}
                </p>
              )}
            </div>

            <hr className="my-6" />

            <h3 className="text-md font-bold text-[#0f5c4d]">Datos Bancarios (Opcional)</h3>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                Banco
              </label>
              {editando ? (
                <input
                  type="text"
                  value={formData.banco || ""}
                  onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                  placeholder="Ej: BROU, Santander, Itaú"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm"
                />
              ) : (
                <p className="px-3 py-2.5 bg-gray-50 rounded-md text-sm text-gray-700">
                  {auth.banco || "No agregado"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                Número de Cuenta
              </label>
              {editando ? (
                <input
                  type="text"
                  value={formData.nroCuenta || ""}
                  onChange={(e) => setFormData({ ...formData, nroCuenta: e.target.value })}
                  placeholder="12345678"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm"
                />
              ) : (
                <p className="px-3 py-2.5 bg-gray-50 rounded-md text-sm text-gray-700">
                  {auth.nroCuenta || "No agregado"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                Sucursal
              </label>
              {editando ? (
                <input
                  type="text"
                  value={formData.sucursal || ""}
                  onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })}
                  placeholder="Ej: Centro, Pocitos"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm"
                />
              ) : (
                <p className="px-3 py-2.5 bg-gray-50 rounded-md text-sm text-gray-700">
                  {auth.sucursal || "No agregado"}
                </p>
              )}
            </div>

            {editando && (
              <button
                onClick={handleSave}
                className="w-full bg-[#0f5c4d] text-white font-medium py-2.5 rounded-md hover:opacity-90 mt-6"
              >
                ✓ Guardar cambios
              </button>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          <p className="font-medium mb-2">ℹ️ Información importante:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Tu contraseña solo puede ser cambiada por el administrador</li>
            <li>Los datos bancarios son opcionales</li>
            <li>El administrador puede ver y editar todos tus datos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
