"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthData {
  role: string;
  email: string;
}

export default function ContratosFisios() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaFirma, setFechaFirma] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [archivoFirma, setArchivoFirma] = useState<File | null>(null);
  const [archivoNombre, setArchivoNombre] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("panelAuth");
    if (!data || JSON.parse(data).role !== "admin") {
      router.push("/panel-pagos");
    } else {
      setAuth(JSON.parse(data));
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoFirma(file);
      setArchivoNombre(file.name);
    }
  };

  const handleDescargarPDF = () => {
    const element = document.getElementById("contrato-pdf");
    if (element) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(element.innerHTML);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleGuardarContrato = async () => {
    if (!nombre || !cedula || !telefono) {
      setMensaje("Por favor completa todos los datos");
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch("/api/panel-pagos/contratos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: auth?.email || "admin@reactive.com",
          nombre,
          cedula,
          telefono,
          fechaFirma,
        }),
      });

      if (response.ok) {
        setMensaje("✓ Contrato guardado correctamente");
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setMensaje("Error al guardar el contrato");
      }
    } catch (error) {
      setMensaje("Error de conexión");
    }
    setGuardando(false);
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
            <h1 className="text-2xl font-bold text-[#0f5c4d]">
              Contratos de Fisioterapeutas
            </h1>
            <p className="text-sm text-gray-600">
              Plantilla y gestión de contratos
            </p>
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
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div id="contrato-pdf" className="space-y-6 text-gray-900">
            {/* Encabezado */}
            <div className="text-center border-b-2 border-gray-300 pb-6">
              <h2 className="text-3xl font-bold text-[#0f5c4d] mb-2">
                REACTIVE CLINIC
              </h2>
              <p className="text-sm text-gray-600">Clínica de Fisioterapia</p>
              <p className="text-xs text-gray-500 mt-2">
                Montevideo, Uruguay
              </p>
            </div>

            {/* Título */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#0f5c4d] mb-2">
                CONTRATO DE SERVICIOS DE FISIOTERAPIA
              </h3>
              <p className="text-sm text-gray-600">
                Régimen de Pago y Condiciones de Trabajo
              </p>
            </div>

            {/* Datos del Fisio */}
            <div className="space-y-3 border-l-4 border-[#0f5c4d] pl-4">
              <p className="font-semibold text-[#0f5c4d]">DATOS DEL FISIOTERAPEUTA</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Nombre Completo:</p>
                  <p className="font-semibold">
                    {nombre || "___________________________"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Cédula de Identidad:</p>
                  <p className="font-semibold">
                    {cedula || "___________________________"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Teléfono:</p>
                  <p className="font-semibold">
                    {telefono || "___________________________"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha de Firma:</p>
                  <p className="font-semibold">
                    {fechaFirma
                      ? new Date(fechaFirma + "T00:00:00").toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "___________________________"}
                  </p>
                </div>
              </div>
            </div>

            {/* Régimen de Pago */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#0f5c4d] text-lg border-b-2 border-gray-300 pb-2">
                RÉGIMEN DE PAGO
              </h4>

              <div className="space-y-3 text-sm">
                <div className="bg-[#eef4f6] p-4 rounded border-l-4 border-[#2563eb]">
                  <p className="font-semibold text-[#0f5c4d] mb-2">
                    1. ATENCIÓN EN CLÍNICA
                  </p>
                  <ul className="space-y-1 ml-4 list-disc text-gray-700">
                    <li>
                      <strong>1-2 pacientes por hora:</strong> $250 por paciente
                      (ej: 2 pacientes = $500/hora)
                    </li>
                    <li>
                      <strong>3 o más pacientes por hora:</strong> $450 por hora
                      (tarifa fija, independiente de cantidad)
                    </li>
                    <li>
                      <strong>Sábados - 1-2 pacientes por hora:</strong> $350
                      por paciente
                    </li>
                    <li>
                      <strong>Sábados - 3 o más pacientes:</strong> $550 por
                      hora (tarifa fija)
                    </li>
                  </ul>
                </div>

                <div className="bg-[#eef4f6] p-4 rounded border-l-4 border-[#2563eb]">
                  <p className="font-semibold text-[#0f5c4d] mb-2">
                    2. ATENCIÓN EN DOMICILIO
                  </p>
                  <ul className="space-y-1 ml-4 list-disc text-gray-700">
                    <li>
                      <strong>Domicilio A (antes del peaje / Montevideo):</strong>{" "}
                      +$700 por sesión
                    </li>
                    <li>
                      <strong>Domicilio B (después del peaje):</strong> +$1000
                      por sesión
                    </li>
                  </ul>
                </div>

                <div className="bg-[#eef4f6] p-4 rounded border-l-4 border-[#2563eb]">
                  <p className="font-semibold text-[#0f5c4d] mb-2">
                    3. CONTROL DE SESIONES
                  </p>
                  <p className="text-gray-700">
                    Los pacientes compran paquetes de sesiones. El sistema
                    registra automáticamente las sesiones realizadas.
                  </p>
                </div>

                <div className="bg-[#eef4f6] p-4 rounded border-l-4 border-[#2563eb]">
                  <p className="font-semibold text-[#0f5c4d] mb-2">
                    4. COMPROBANTES DE PAGO
                  </p>
                  <p className="text-gray-700">
                    Los comprobantes se generan mensualmente. Puedes descargarlos
                    desde tu panel de usuario o solicitarlos a administración.
                  </p>
                </div>
              </div>
            </div>

            {/* Obligaciones */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#0f5c4d] text-lg border-b-2 border-gray-300 pb-2">
                OBLIGACIONES Y CONDICIONES
              </h4>
              <ul className="space-y-2 text-sm ml-4 list-disc text-gray-700">
                <li>
                  Registrar todas las sesiones en el sistema al finalizar cada
                  día
                </li>
                <li>
                  Respetar los horarios pactados con los pacientes y la clínica
                </li>
                <li>
                  Mantener confidencialidad de la información de pacientes
                </li>
                <li>Notificar cambios en disponibilidad con anticipación</li>
                <li>
                  Cumplir con protocolos sanitarios y de calidad de Reactive
                  Clinic
                </li>
              </ul>
            </div>

            {/* Firma */}
            <div className="border-t-2 border-gray-300 pt-6 mt-8">
              <p className="text-sm text-gray-600 mb-6">
                Al firmar este contrato, confirmo que he leído y acepto el
                régimen de pago y las condiciones de trabajo de Reactive Clinic.
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600">Firma del Fisioterapeuta</p>
                  <p className="mt-8 border-b border-gray-400 w-48"></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Firma Administración Reactive
                  </p>
                  <p className="mt-8 border-b border-gray-400 w-48"></p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón Descargar */}
          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleDescargarPDF}
              className="w-full bg-[#2563eb] text-white font-medium py-2.5 rounded-md hover:opacity-90"
            >
              📥 Descargar como PDF
            </button>
          </div>
        </div>

        {/* Formulario de datos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#0f5c4d] mb-6">
            Rellenar datos del contrato
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Cédula de Identidad
                </label>
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="Ej: 1.234.567-8"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: 098765432"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f5c4d] mb-2">
                Fecha de Firma
              </label>
              <input
                type="date"
                value={fechaFirma}
                onChange={(e) => setFechaFirma(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Subir firma */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#0f5c4d] mb-6">
            Subir Contrato Firmado
          </h3>

          {mensaje && (
            <div className={`mb-4 p-4 rounded text-sm ${
              mensaje.includes("✓")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {mensaje}
            </div>
          )}

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block"
              >
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm font-medium text-[#0f5c4d] mb-1">
                  {archivoNombre || "Seleccionar archivo"}
                </p>
                <p className="text-xs text-gray-600">
                  Foto del contrato firmado (JPG, PNG) o PDF
                </p>
              </label>
            </div>

            {archivoFirma && (
              <div className="bg-green-50 border border-green-200 p-4 rounded text-sm text-green-700">
                ✓ Archivo listo: {archivoNombre}
              </div>
            )}

            <button
              onClick={handleGuardarContrato}
              disabled={guardando}
              className="w-full bg-[#0f5c4d] text-white font-medium py-2.5 rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "✓ Guardar Contrato Firmado"}
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 pb-6">
          <p>Reactive Clinic © 2026 - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}
