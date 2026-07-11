-- Insertar usuarios en Supabase
-- Ejecutar en: Supabase → SQL Editor

-- Eliminar usuarios anteriores (excepto admin)
DELETE FROM usuarios WHERE rol != 'admin';

-- Insertar usuarios fisios y socio
INSERT INTO usuarios (email, nombre, rol, password) VALUES
('martuvz@gmail.com', 'Martina', 'Fisio', 'reactive.fisio3'),
('fisioigalvilla@gmail.com', 'Igal Villa', 'Socio', 'reactive.socio1'),
('manu.lara.01@gmail.com', 'Manuela', 'Fisio', 'reactive.fisio2');

-- Verificar que se insertaron
SELECT * FROM usuarios ORDER BY rol DESC;
