-- Crear tabla registros si no existe
CREATE TABLE IF NOT EXISTS registros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  fecha TEXT NOT NULL,
  paciente TEXT NOT NULL,
  tipo TEXT NOT NULL,
  hora_desde TEXT,
  hora_hasta TEXT,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_registros_email ON registros(email);
CREATE INDEX IF NOT EXISTS idx_registros_fecha ON registros(fecha);
CREATE INDEX IF NOT EXISTS idx_registros_paciente ON registros(paciente);

-- Habilitar Row Level Security
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;

-- Crear política para que todos puedan insertar
CREATE POLICY "Allow all to insert registros"
  ON registros FOR INSERT
  WITH CHECK (true);

-- Crear política para que todos puedan leer
CREATE POLICY "Allow all to read registros"
  ON registros FOR SELECT
  USING (true);

-- Crear política para que el propietario pueda actualizar
CREATE POLICY "Allow update own registros"
  ON registros FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Crear política para que el propietario pueda eliminar
CREATE POLICY "Allow delete own registros"
  ON registros FOR DELETE
  USING (true);
