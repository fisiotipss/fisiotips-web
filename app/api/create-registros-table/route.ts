import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (token !== process.env.INIT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase no configurado" },
        { status: 500 }
      );
    }

    // Crear tabla registros
    const { error: createError } = await supabase.rpc("create_registros_table", {});

    if (createError) {
      console.log("Tabla podría ya existir:", createError);
    }

    // Insertar dato de prueba
    const testRecord = {
      email: "test@test.com",
      fecha: "2026-07-17",
      paciente: "Test Paciente",
      tipo: "clinica",
      hora_desde: "08:00",
      hora_hasta: "09:00",
      observaciones: "Sesión de prueba",
    };

    const { data, error: insertError } = await supabase
      .from("registros")
      .insert([testRecord])
      .select();

    if (insertError) {
      console.error("Error al insertar:", insertError);
      return NextResponse.json({
        success: false,
        error: insertError.message,
        message: "La tabla 'registros' podría no existir. Crea la tabla manualmente en Supabase SQL Editor",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Tabla verificada y funcionando",
      testData: data,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
