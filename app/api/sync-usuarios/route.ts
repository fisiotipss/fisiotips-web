import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase no está configurado" }, { status: 500 });
    }

    // Usuarios a sincronizar
    const usuariosParaSincronizar = [
      {
        email: "martuvz@gmail.com",
        nombre: "Martina",
        rol: "Fisio",
        password: "reactive.fisio3",
      },
      {
        email: "fisioigalvilla@gmail.com",
        nombre: "Igal Villa",
        rol: "Socio",
        password: "reactive.socio1",
      },
      {
        email: "manu.lara.01@gmail.com",
        nombre: "Manuela",
        rol: "Fisio",
        password: "reactive.fisio2",
      },
    ];

    // Obtener usuarios actuales
    const { data: usuariosActuales, error: fetchError } = await supabase
      .from("usuarios")
      .select("email")
      .neq("rol", "admin");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const emailsActuales = (usuariosActuales || []).map((u: any) => u.email);

    // Insertar usuarios faltantes
    const usuariosAInsertar = usuariosParaSincronizar.filter(
      (u) => !emailsActuales.includes(u.email)
    );

    if (usuariosAInsertar.length > 0) {
      const { error: insertError } = await supabase
        .from("usuarios")
        .insert(usuariosAInsertar);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    // Obtener todos los usuarios
    const { data: usuariosFinales, error: finalError } = await supabase
      .from("usuarios")
      .select("*")
      .order("rol");

    if (finalError) {
      return NextResponse.json({ error: finalError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Sincronización completada. ${usuariosAInsertar.length} usuario(s) insertado(s).`,
      usuariosInsertados: usuariosAInsertar.length,
      totalUsuarios: usuariosFinales?.length || 0,
      usuarios: usuariosFinales,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
