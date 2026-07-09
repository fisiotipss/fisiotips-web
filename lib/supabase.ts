import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          email: string;
          nombre: string;
          rol: "fisio" | "socio" | "admin";
          sucursal: "lagomar" | "shangrila";
          numero_cuenta: string;
          creado_en: string;
        };
        Insert: Omit<Database["public"]["Tables"]["usuarios"]["Row"], "id">;
      };
      pacientes: {
        Row: {
          id: string;
          nombre: string;
          apellido: string;
          lesion: string;
          sesiones_compradas: number;
          creado_en: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pacientes"]["Row"], "id">;
      };
      registros: {
        Row: {
          id: string;
          fisio_id: string;
          paciente_id: string;
          fecha: string;
          tipo: "clinica" | "domicilio_a" | "domicilio_b";
          hora_inicio: string | null;
          hora_fin: string | null;
          observaciones: string | null;
          creado_en: string;
        };
        Insert: Omit<Database["public"]["Tables"]["registros"]["Row"], "id">;
      };
      comprobantes: {
        Row: {
          id: string;
          fisio_id: string;
          mes: string;
          monto_total: number;
          pdf_url: string;
          enviado_en: string | null;
          email_fisio: string;
        };
        Insert: Omit<Database["public"]["Tables"]["comprobantes"]["Row"], "id">;
      };
    };
  };
};
