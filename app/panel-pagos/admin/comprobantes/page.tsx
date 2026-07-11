"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  role: string;
  email: string;
  name: string;
}

interface Usuario {
  email: string;
  nombre: string;
  rol: string;
}

interface Registro {
  email: string;
  fecha: string;
  paciente: string;
}

interface Comprobante {
  id: string;
  email: string;
  nombre: string;
  mes: string;
  monto: number;
  estado: "pendiente" | "enviado";
}

export default function GestionarComprobantes() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
  const [selectedMes, setSelectedMes] = useState(() => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
  });
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data || JSON.parse(data).role !== "admin") {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
      cargarDatos();
    }
  }, [router]);

  useEffect(() => {
    if (auth) {
      cargarComprobantes();
    }
  }, [selectedMes, auth]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (auth) {
        cargarDatos();
        cargarComprobantes();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [auth]);

  const cargarDatos = async () => {
    try {
      const res = await fetch("/api/panel-pagos/usuarios");
      if (res.ok) {
        const { data } = await res.json();
        // Filtrar solo fisios y socios
        const usuariosActivos = (data || []).filter(
          (u: Usuario) => u.rol !== "admin"
        );
        setUsuarios(usuariosActivos);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const cargarComprobantes = async () => {
    try {
      const res = await fetch(`/api/panel-pagos/registros?mes=${selectedMes}&allUsers=true`);
      if (res.ok) {
        const { data: registros } = await res.json();

        // Agrupar por usuario y calcular montos
        const porUsuario = new Map<string, Registro[]>();
        (registros || []).forEach((reg: Registro) => {
          if (!porUsuario.has(reg.email)) {
            porUsuario.set(reg.email, []);
          }
          porUsuario.get(reg.email)!.push(reg);
        });

        const comprobantesCalculados: Comprobante[] = [];
        porUsuario.forEach((regs, email) => {
          const usuario = usuarios.find((u) => u.email === email);
          const monto =
            usuario?.rol === "Socio"
              ? regs.length * 350
              : regs.length * 250;

          comprobantesCalculados.push({
            id: email,
            email,
            nombre: usuario?.nombre || email,
            mes: selectedMes,
            monto,
            estado: "pendiente",
          });
        });

        setComprobantes(comprobantesCalculados);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedUsuario || !file) {
      alert("Selecciona un usuario y un archivo");
      return;
    }

    setLoading(true);
    try {
      const comprobante = comprobantes.find((c) => c.id === selectedUsuario);
      if (!comprobante) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", comprobante.email);
      formData.append("mes", selectedMes);

      const uploadRes = await fetch("/api/panel-pagos/comprobantes/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        setSuccess("✓ Comprobante subido y enviado correctamente");
        setFile(null);
        setSelectedUsuario("");
        cargarComprobantes();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al subir comprobante");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("panelAuth");
    router.push("/panel-pagos");
  };

  if (!auth) return null;

  const meses = [
    "2026-06",
    "2026-07",
    "2026-08",
    "2026-09",
    "2026-10",
    "2026-11",
    "2026-12",
  ];

  const getNombreMes = (mesStr: string) => {
    const [year, month] = mesStr.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
      "es-ES",
      { month: "long", year: "numeric" }
    );
  };

  const totalMonto = comprobantes.reduce((sum, c) => sum + c.monto, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4f6] to-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5c4d]">ReActive</h1>
            <p className="text-sm text-gray-600">Enviar comprobantes de pago</p>
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

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-6">
            Subir comprobante de pago
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Mes
              </label>
              <select
                value={selectedMes}
                onChange={(e) => setSelectedMes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {meses.map((m) => (
                  <option key={m} value={m}>
                    {getNombreMes(m)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Seleccionar usuario con pago pendiente
              </label>
              <select
                value={selectedUsuario}
                onChange={(e) => setSelectedUsuario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Elegir...</option>
                {comprobantes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} - ${c.monto}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Archivo (PDF o imagen)
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    document.getElementById("fileInput")?.click()
                  }
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                >
                  Seleccionar archivo
                </button>
                <span className="text-sm text-gray-600">
                  {file ? file.name : "Ningún archivo seleccionado"}
                </span>
              </div>
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !selectedUsuario || !file}
              className="w-full bg-[#0f5c4d] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Subiendo..." : "Subir y enviar"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#0f5c4d] mb-4">
            Comprobantes de {getNombreMes(selectedMes)}
          </h2>

          {comprobantes.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No hay registros para este mes
            </p>
          ) : (
            <div className="space-y-3">
              {comprobantes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-[#0f5c4d]">{c.nombre}</p>
                    <p className="text-sm text-gray-600">{c.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-[#0f5c4d]">
                      ${c.monto}
                    </p>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded ${
                        c.estado === "enviado"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.estado === "enviado" ? "✓ Enviado" : "Pendiente"}
                    </span>
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t-2 border-gray-200 flex justify-between">
                <span className="font-bold text-[#0f5c4d]">Total mes:</span>
                <span className="font-bold text-2xl text-[#0f5c4d]">
                  ${totalMonto}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
