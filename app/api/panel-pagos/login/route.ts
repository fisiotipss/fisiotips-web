import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const ADMIN_EMAIL = "reactive.admin@clinic.com";
const ADMIN_PASSWORD = "reactive.admin1";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 }
      );
    }

    // Validar admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        email,
        role: "admin",
        name: "Administrador",
      });
    }

    // Validar usuarios desde Supabase
    if (!supabase) {
      return NextResponse.json(
        { error: "Base de datos no configurada" },
        { status: 500 }
      );
    }

    const { data: usuarios, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email);

    if (error || !usuarios || usuarios.length === 0) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const usuario = usuarios[0];

    // Validar contraseña
    if (usuario.password !== password) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      email: usuario.email,
      role: usuario.rol,
      name: usuario.nombre,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
