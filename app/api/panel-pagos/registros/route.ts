import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

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

    if (!supabase) {
      return NextResponse.json(
        { error: "Base de datos no configurada" },
        { status: 500 }
      );
    }

    const { data: regData, error: regError } = await supabase
      .from("registros")
      .insert([registro])
      .select();

    if (regError) {
      console.error("Error al insertar registro:", regError);
      return NextResponse.json(
        { error: "Error al registrar paciente" },
        { status: 500 }
      );
    }

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

    if (mes) {
      query = query.ilike("fecha", `${mes}%`);
    }

    if (!allUsers) {
      query = query.order("fecha", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ data: [] });
  }
}
