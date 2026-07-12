-- Tabla de usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  banco VARCHAR(100),
  nro_cuenta VARCHAR(50),
  sucursal VARCHAR(100),
  foto_url VARCHAR(500),
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de registros (sesiones)
CREATE TABLE registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  fecha DATE NOT NULL,
  paciente VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  clinica VARCHAR(100),
  domicilio VARCHAR(20),
  hora_desde TIME,
  hora_hasta TIME,
  observaciones TEXT,
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (email) REFERENCES usuarios(email)
);

-- Tabla de pacientes
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  lesion TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  sesiones_compradas INTEGER DEFAULT 0,
  sesiones_disponibles INTEGER DEFAULT 0,
  notas TEXT,
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX idx_registros_email ON registros(email);
CREATE INDEX idx_registros_fecha ON registros(fecha);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Usuarios pueden ver su propia información
CREATE POLICY "Usuarios ven su info" ON usuarios
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Admin ve todo
CREATE POLICY "Admin ve todo" ON usuarios
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Registros: cada usuario ve sus registros
CREATE POLICY "Usuarios ven sus registros" ON registros
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Admin ve todos los registros
CREATE POLICY "Admin ve todos registros" ON registros
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Pacientes: todos pueden ver
CREATE POLICY "Todos ven pacientes" ON pacientes
  FOR SELECT USING (true);
