import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase no está configurado" },
        { status: 500 }
      );
    }

    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("usuarios")
      .update({ password: newPassword })
      .eq("email", email)
      .select();

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json(
        { error: "Error al cambiar contraseña" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mensaje: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al cambiar contraseña" },
      { status: 500 }
    );
  }
}
