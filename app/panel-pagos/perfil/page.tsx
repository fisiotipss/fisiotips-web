"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UsuarioData {
  email: string;
  nombre: string;
  telefono?: string;
  banco?: string;
  nro_cuenta?: string;
  sucursal?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [usuario, setUsuario] = useState<UsuarioData>({
    email: "",
    nombre: "",
    telefono: "",
    banco: "",
    nro_cuenta: "",
    sucursal: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (email) {
      cargarUsuario();
    }
  }, [email]);

  const cargarUsuario = async () => {
    try {
      const res = await fetch(`/api/panel-pagos/usuarios?email=${email}`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setUsuario(data.data[0]);
      }
    } catch (error) {
      console.error("Error cargando usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/panel-pagos/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error guardando:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">ReActive</h1>
            <p className="text-sm text-gray-600">Editar perfil</p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Atrás
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#0f5c4d] mb-6">
            Datos personales
          </h2>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded">
              ✓ Perfil actualizado correctamente
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Email
              </label>
              <input
                type="email"
                value={usuario.email}
                disabled
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={usuario.nombre}
                onChange={(e) =>
                  setUsuario({ ...usuario, nombre: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={usuario.telefono || ""}
                onChange={(e) =>
                  setUsuario({ ...usuario, telefono: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-[#0f5c4d] mb-4">
                Datos bancarios
              </h3>

              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Banco
                </label>
                <input
                  type="text"
                  value={usuario.banco || ""}
                  onChange={(e) =>
                    setUsuario({ ...usuario, banco: e.target.value })
                  }
                  placeholder="BROU, Itaú, Scotiabank, etc."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Número de cuenta
                </label>
                <input
                  type="text"
                  value={usuario.nro_cuenta || ""}
                  onChange={(e) =>
                    setUsuario({ ...usuario, nro_cuenta: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Sucursal (opcional)
                </label>
                <input
                  type="text"
                  value={usuario.sucursal || ""}
                  onChange={(e) =>
                    setUsuario({ ...usuario, sucursal: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#2563eb] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-2.5 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
