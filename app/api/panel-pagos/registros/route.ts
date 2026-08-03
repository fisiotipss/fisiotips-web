import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

function agruparHora(horaDesde: string): string {
  if (!horaDesde) return "";
  const [horas, minutos] = horaDesde.split(":").map(Number);
  const minInt = minutos || 0;
  const horaAgrupada = minInt >= 40 ? horas + 1 : horas;
  return `${String(horaAgrupada).padStart(2, "0")}:00`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, fecha, paciente, tipo, horaDesde, horaHasta, observaciones } =
      await request.json();

    if (!email || !paciente || !tipo) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    if (tipo === "clinica" && (!horaDesde || !horaHasta)) {
      return NextResponse.json(
        { error: "Horarios requeridos para clínica" },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: "Base de datos no configurada" },
        { status: 500 }
      );
    }

    // Validación 1: Paciente no existe el MISMO DÍA
    const { data: duplicados } = await supabase
      .from("registros")
      .select("id")
      .eq("email", email)
      .eq("fecha", fecha)
      .eq("paciente", paciente)
      .limit(1);

    if (duplicados && duplicados.length > 0) {
      return NextResponse.json(
        { error: "Paciente ya registrado hoy" },
        { status: 400 }
      );
    }


    const tipoNormalizado =
      tipo === "clinica"
        ? "clinica"
        : tipo === "domicilio-a"
          ? "domicilio_a"
          : "domicilio_b";

    const registro = {
      email,
      fecha,
      paciente,
      tipo: tipoNormalizado,
      hora_desde: horaDesde,
      hora_hasta: horaHasta,
      observaciones,
    };

    console.log("Intentando insertar registro:", registro);

    const { data: regData, error: regError } = await supabase
      .from("registros")
      .insert([registro])
      .select();

    if (regError) {
      console.error("Error Supabase POST:", JSON.stringify(regError));
      return NextResponse.json(
        { error: `Error al registrar: ${regError.message}`, details: regError },
        { status: 500 }
      );
    }

    console.log("Registro insertado:", regData);

    const { data: pacientes, error: pacError } = await supabase
      .from("pacientes")
      .select("sesiones_disponibles")
      .eq("nombre", paciente.split(" ")[0])
      .limit(1);

    if (pacError || !pacientes || pacientes.length === 0) {
      return NextResponse.json({
        success: true,
        mensaje: "Paciente registrado correctamente",
        registro: regData?.[0],
      });
    }

    const sesionesDisponibles = Math.max(
      0,
      (pacientes[0].sesiones_disponibles || 1) - 1
    );

    await supabase
      .from("pacientes")
      .update({ sesiones_disponibles: sesionesDisponibles })
      .eq("nombre", paciente.split(" ")[0]);

    return NextResponse.json({
      success: true,
      mensaje: "Paciente registrado correctamente",
      registro: regData?.[0],
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al registrar paciente" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ data: [] });
    }

    const email = request.nextUrl.searchParams.get("email");
    const mes = request.nextUrl.searchParams.get("mes");
    const allUsers = request.nextUrl.searchParams.get("allUsers");

    let query = supabase.from("registros").select("*");

    if (email) {
      query = query.eq("email", email);
    }

    // No filtrar por mes en Supabase, hacerlo en código
    const { data, error } = await query.order("fecha", { ascending: false });

    if (error) {
      console.error("Error Supabase GET:", error);
      return NextResponse.json({ data: [] });
    }

    // Filtrar por mes en código
    let filteredData = data || [];
    if (mes && mes.trim()) {
      console.log(`[API] Filtering by mes: ${mes}, total registros: ${filteredData.length}`);
      filteredData = filteredData.filter((r: any) => {
        const fecha = String(r.fecha || "");
        const match = fecha.startsWith(mes);
        if (!match) {
          console.log(`[API] No match: fecha=${fecha}, mes=${mes}`);
        }
        return match;
      });
      console.log(`[API] After filter: ${filteredData.length} registros`);
    }

    return NextResponse.json({
      data: filteredData,
      debug: { mes, totalBeforeFilter: data?.length || 0, totalAfterFilter: filteredData.length }
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ data: [] });
  }
}

