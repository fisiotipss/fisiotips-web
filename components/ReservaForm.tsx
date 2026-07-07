"use client";

import { useState } from "react";
import { consulta } from "@/content/site-copy";
import Reveal from "./Reveal";

const demandaFisicaOpciones = [
  { value: "sedentario", label: "Trabajo mayormente sentado / sedentario" },
  { value: "moderado", label: "Trabajo con esfuerzo físico moderado (caminar, estar de pie)" },
  { value: "intenso", label: "Trabajo con esfuerzo físico intenso / carga" },
];

type Estado = "idle" | "enviando" | "error";

export default function ReservaForm() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/consulta", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo enviar el formulario.");
      }

      window.location.href = consulta.mercadoPagoLink;
    } catch (err) {
      setEstado("error");
      setErrorMsg(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    }
  }

  return (
    <section id="consulta" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Reveal>
        <h2 className="text-center text-2xl font-bold text-primary sm:text-3xl">
          {consulta.titulo}
        </h2>
        <p className="mt-3 text-center text-gray-600">{consulta.descripcion}</p>
        <p className="mt-1 text-center text-lg font-semibold text-primary">
          {consulta.precioTexto} · {consulta.duracion}
        </p>
      </Reveal>

      <Reveal delay={100} className="mt-6 rounded-2xl border border-primary/20 bg-primary-light p-6">
        <h3 className="font-semibold text-primary">Qué incluye la evaluación</h3>
        <ul className="mt-3 space-y-2">
          {consulta.incluye.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span aria-hidden>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="mt-8 space-y-5 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo label="Nombre completo" name="nombre" required />
          <Campo label="Teléfono de emergencia" name="telefonoEmergencia" required type="tel" />
          <Campo label="Edad" name="edad" required type="number" min={0} />
          <Campo label="Deporte que realiza" name="deporte" required />
          <Campo label="Ciudad / país" name="ubicacion" required />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              A qué te dedicás (nivel de esfuerzo físico)
            </label>
            <select
              name="demandaFisica"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-celeste focus:outline-none focus:ring-1 focus:ring-celeste"
              defaultValue=""
            >
              <option value="" disabled>
                Seleccioná una opción
              </option>
              {demandaFisicaOpciones.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CampoTextarea label="Motivo de consulta" name="motivoConsulta" required />
        <CampoTextarea
          label="Tratamientos realizados hasta ahora y resultados"
          name="tratamientosPrevios"
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Estudios médicos (PDF o JPG, opcional)
          </label>
          <input
            type="file"
            name="estudios"
            accept="application/pdf,image/jpeg,image/png"
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary-light file:px-4 file:py-2 file:text-sm file:font-medium file:text-celeste hover:file:bg-celeste/10"
          />
          <p className="mt-1 text-xs text-gray-400">Tamaño máximo recomendado: 8 MB.</p>
        </div>

        {estado === "error" && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={estado === "enviando"}
          className="w-full rounded-full bg-celeste px-6 py-3 text-sm font-semibold text-white transition-colors hover:brightness-90 disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando..." : `Enviar y pagar ${consulta.precioTexto} con Mercado Pago`}
        </button>
      </form>
    </section>
  );
}

function Campo({
  label,
  name,
  required,
  type = "text",
  min,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  min?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        min={min}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-celeste focus:outline-none focus:ring-1 focus:ring-celeste"
      />
    </div>
  );
}

function CampoTextarea({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        required={required}
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-celeste focus:outline-none focus:ring-1 focus:ring-celeste"
      />
    </div>
  );
}
