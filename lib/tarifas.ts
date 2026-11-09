// Reglas de cobro para sesiones cargadas desde el 2026-11-09 (tarifa_version = 2).
// Las sesiones anteriores (tarifa_version null) siguen con el cálculo original.

export const TARIFA_VERSION_NUEVA = 2;

export const TOPE = {
  Fisio: { pacientes: 5, dinero: 550, normal: 250, entrenamiento: 200 },
  Socio: { pacientes: 4, dinero: 1400, normal: 350, entrenamiento: 300 },
} as const;

// Ignora mayúsculas y acentos: "Entrenamiento", "entrenamiento personalizado", etc.
export function esEntrenamiento(lesion: string | null | undefined): boolean {
  if (!lesion) return false;
  const limpio = lesion.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return limpio.includes("entrenamiento");
}

// Nombre y apellido normalizados: sin espacios dobles ni sobrantes.
export function normalizarNombre(texto: string): string {
  return texto.trim().replace(/\s+/g, " ");
}

type SesionClinica = { id: string; es_entrenamiento?: boolean | null; creado?: string | null };

// Monto de cada sesión clínica de una misma franja horaria.
// Se cobra en orden de carga; cada sesión toma lo que queda hasta el tope de dinero,
// y si supera la cantidad máxima de pacientes, queda en 0.
export function montosFranjaNueva(sesiones: SesionClinica[], rol: "Fisio" | "Socio"): Map<string, number> {
  const t = TOPE[rol];
  const ordenadas = [...sesiones].sort(
    (a, b) => (a.creado || "").localeCompare(b.creado || "") || a.id.localeCompare(b.id)
  );

  const montos = new Map<string, number>();
  let cantidad = 0;
  let acumulado = 0;

  for (const s of ordenadas) {
    cantidad++;
    const valor = s.es_entrenamiento ? t.entrenamiento : t.normal;
    if (cantidad > t.pacientes) {
      montos.set(s.id, 0);
      continue;
    }
    const disponible = Math.max(0, t.dinero - acumulado);
    const monto = Math.min(valor, disponible);
    acumulado += monto;
    montos.set(s.id, monto);
  }

  return montos;
}

export function agruparHora(horaDesde: string): string {
  if (!horaDesde) return "";
  const [horas, minutos] = horaDesde.split(":").map(Number);
  const minInt = minutos || 0;
  const horaAgrupada = minInt >= 40 ? horas + 1 : horas;
  return `${String(horaAgrupada).padStart(2, "0")}:00`;
}

export type RegistroCobro = {
  id: string;
  fecha: string;
  tipo: string;
  hora_desde?: string | null;
  tarifa_version?: number | null;
  es_entrenamiento?: boolean | null;
  creado?: string | null;
};

export type DetalleCobro = { fecha: string; hora: string; pacientes: number; precio: number };

// Cobros de un usuario. Sesiones viejas: fórmula original. Sesiones nuevas (clínica): reglas con tope.
export function calcularCobros(regs: RegistroCobro[], rol: "Fisio" | "Socio") {
  const esSocio = rol === "Socio";
  const viejas = regs.filter((r) => r.tarifa_version !== TARIFA_VERSION_NUEVA);
  const nuevas = regs.filter((r) => r.tarifa_version === TARIFA_VERSION_NUEVA && r.tipo === "clinica");
  const montoPorRegistro = new Map<string, number>();
  const detalles: DetalleCobro[] = [];

  // Sesiones viejas
  const grupos = new Map<string, RegistroCobro[]>();
  viejas.forEach((r) => {
    let key = "";
    if (r.tipo === "clinica" && r.hora_desde) key = `${r.fecha}|clinica|${agruparHora(r.hora_desde)}`;
    else if (r.tipo === "domicilio_a") key = `${r.fecha}|domicilio_a`;
    else if (r.tipo === "domicilio_b") key = `${r.fecha}|domicilio_b`;
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key)!.push(r);
  });

  grupos.forEach((lista, key) => {
    const [fecha, ...resto] = key.split("|");
    const n = lista.length;
    let precio = 0;
    let hora = "";
    if (resto[0] === "clinica") {
      hora = resto[1];
      if (esSocio) precio = n * 350;
      else precio = n >= 3 ? 550 : n === 2 ? 500 : 250;
      lista.forEach((r) => montoPorRegistro.set(r.id, precio / n));
    } else if (resto[0] === "domicilio_a") {
      hora = "Domicilio A";
      precio = esSocio ? n * 350 : 700;
      lista.forEach((r) => montoPorRegistro.set(r.id, esSocio ? 350 : 700));
    } else if (resto[0] === "domicilio_b") {
      hora = "Domicilio B";
      precio = esSocio ? n * 350 : 1000;
      lista.forEach((r) => montoPorRegistro.set(r.id, esSocio ? 350 : 1000));
    }
    detalles.push({ fecha, hora, pacientes: n, precio });
  });

  // Sesiones nuevas, por franja horaria
  const franjas = new Map<string, RegistroCobro[]>();
  nuevas.forEach((r) => {
    const key = `${r.fecha}|${agruparHora(r.hora_desde || "")}`;
    if (!franjas.has(key)) franjas.set(key, []);
    franjas.get(key)!.push(r);
  });

  franjas.forEach((lista, key) => {
    const [fecha, hora] = key.split("|");
    const montos = montosFranjaNueva(lista, rol);
    let precio = 0;
    lista.forEach((r) => {
      const m = montos.get(r.id) ?? 0;
      montoPorRegistro.set(r.id, m);
      precio += m;
    });
    detalles.push({ fecha, hora, pacientes: lista.length, precio });
  });

  const total = detalles.reduce((s, d) => s + d.precio, 0);
  return { detalles, total, montoPorRegistro };
}
