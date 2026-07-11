"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  role: string;
}

interface Usuario {
  email: string;
  nombre: string;
  rol: string;
  password?: string;
  creado?: string;
  telefono?: string;
  banco?: string;
  nroCuenta?: string;
}

export default function CrearUsuarios() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("Fisio");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Usuario | null>(null);
  const [editForm, setEditForm] = useState<Partial<Usuario>>({});

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data || JSON.parse(data).role !== "admin") {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
      cargarUsuarios();
    }
  }, [router]);

  // Auto-refresco cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (auth) cargarUsuarios();
    }, 2000);
    return () => clearInterval(interval);
  }, [auth]);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("/api/panel-pagos/usuarios");
      if (res.ok) {
        const { data } = await res.json();
        setUsuarios(data || []);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const proximaPassword = () => {
    const rolPrefix = rol === "Fisio" ? "fisio" : "socio";
    const usuariosMismoRol = usuarios.filter((u) => u.rol === rol);
    const numero = usuariosMismoRol.length + 1;
    return `reactive.${rolPrefix}${numero}`;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newPassword = proximaPassword();
    const nuevoUsuario = {
      email,
      nombre,
      rol,
      password: newPassword,
    };

    try {
      const res = await fetch("/api/panel-pagos/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (res.ok) {
        setSuccess(`✓ Usuario ${nombre} creado. Contraseña: ${newPassword}`);
        setNombre("");
        setEmail("");
        setRol("Fisio");
        cargarUsuarios();
        setTimeout(() => setSuccess(""), 5000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (usuario: Usuario) => {
    setUsuarioEnEdicion(usuario);
    setEditForm({ ...usuario });
  };

  const handleSaveEdit = async () => {
    if (!usuarioEnEdicion) return;

    try {
      const usuarioActualizado = { ...usuarioEnEdicion, ...editForm };

      // Actualizar en Supabase
      const res = await fetch("/api/panel-pagos/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioActualizado),
      });

      if (res.ok) {
        setSuccess("✓ Usuario actualizado correctamente");
        setUsuarioEnEdicion(null);
        cargarUsuarios();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const copyPassword = (password: string | undefined, email: string) => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopiedId(email);
      setTimeout(() => setCopiedId(null), 2000);
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

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">Crear nuevo usuario</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Juan García"
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
                  placeholder="usuario@email.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Rol
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                >
                  <option value="Fisio">Fisioterapeuta</option>
                  <option value="Socio">Socio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Contraseña (Auto)
                </label>
                <div className="px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-600">
                  {proximaPassword()}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f5c4d] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear usuario"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">
            Usuarios creados ({usuarios.length})
          </h2>
          {usuarios.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No hay usuarios registrados aún
            </p>
          ) : (
            <div className="space-y-3">
              {usuarios.map((user) => (
                <div
                  key={user.email}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex-1 mb-3 md:mb-0">
                    <p className="font-semibold text-[#0f5c4d]">{user.nombre}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      {user.rol}
                      {user.creado && ` • Creado: ${user.creado}`}
                    </p>
                    {user.telefono && (
                      <p className="text-xs text-gray-500">📱 {user.telefono}</p>
                    )}
                    {user.nroCuenta && (
                      <p className="text-xs text-gray-500">
                        🏦 {user.banco} - {user.nroCuenta}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap md:flex-nowrap">
                    {user.password && (
                      <button
                        onClick={() => copyPassword(user.password, user.email)}
                        className={`px-3 py-2 text-xs font-medium rounded transition ${
                          copiedId === user.email
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        {copiedId === user.email ? "✓ Copiado" : "📋 Copiar"}
                      </button>
                    )}
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-3 py-2 bg-purple-100 text-purple-700 text-xs font-medium rounded hover:bg-purple-200"
                    >
                      ✏️ Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {usuarioEnEdicion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <h3 className="text-lg font-bold text-[#0f5c4d] mb-4">Editar usuario</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editForm.nombre || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nombre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Rol
                </label>
                <select
                  value={editForm.rol || ""}
                  onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="Fisio">Fisioterapeuta</option>
                  <option value="Socio">Socio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={editForm.telefono || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, telefono: e.target.value })
                  }
                  placeholder="+598 99 123 456"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Banco (Opcional)
                </label>
                <input
                  type="text"
                  value={editForm.banco || ""}
                  onChange={(e) => setEditForm({ ...editForm, banco: e.target.value })}
                  placeholder="Ej: BROU, Santander"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-1">
                  Número de Cuenta (Opcional)
                </label>
                <input
                  type="text"
                  value={editForm.nroCuenta || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nroCuenta: e.target.value })
                  }
                  placeholder="12345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-[#0f5c4d] text-white font-medium py-2 rounded hover:opacity-90"
                >
                  ✓ Guardar
                </button>
                <button
                  onClick={() => setUsuarioEnEdicion(null)}
                  className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
