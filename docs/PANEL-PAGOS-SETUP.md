# Panel de Pagos ReActive - Guía de Configuración

## Estado Actual

✅ **Implementado en preview (sin publicar):**
- Login con validación (email + contraseña auto-generada)
- Registro de pacientes (nombre, apellido, lesión)
- Formulario de registro de sesiones (clínica/domicilio)
- Dashboard admin con cálculos automáticos
- Gestión de usuarios y pacientes
- Endpoints para upload de comprobantes y envío de emails
- Cliente Supabase configurado

## Próximos Pasos - Configuración de Supabase

### 1. Crear cuenta en Supabase
1. Ir a https://supabase.com
2. Click en "Start your project"
3. Crear cuenta con tu email
4. Crear un nuevo proyecto (elige región: us-east-1)

### 2. Obtener credenciales
En el dashboard de Supabase:
1. Settings → API
2. Copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_KEY`

### 3. Crear tablas en Supabase
Ejecutar en SQL Editor:

```sql
-- Tabla usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('fisio', 'socio', 'admin')),
  sucursal TEXT CHECK (sucursal IN ('lagomar', 'shangrila')),
  numero_cuenta TEXT,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla pacientes
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  lesion TEXT NOT NULL,
  sesiones_compradas INT DEFAULT 0,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla registros
CREATE TABLE registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fisio_id UUID REFERENCES usuarios(id),
  paciente_id UUID REFERENCES pacientes(id),
  fecha DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('clinica', 'domicilio_a', 'domicilio_b')),
  hora_inicio TIME,
  hora_fin TIME,
  observaciones TEXT,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla comprobantes
CREATE TABLE comprobantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fisio_id UUID REFERENCES usuarios(id),
  mes TEXT NOT NULL,
  monto_total DECIMAL(10, 2),
  pdf_url TEXT,
  enviado_en TIMESTAMP,
  email_fisio TEXT NOT NULL
);
```

### 4. Agregar variables de entorno
Crear `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_key_aqui
```

### 5. Instalar dependencias
```bash
npm install
```

### 6. Habilitar Row Level Security (RLS)
En Supabase → Authentication → Policies:
- Crear políticas para que los usuarios solo vean sus propios datos

## Funcionalidades Completadas

### 1. ✅ Gestión de usuarios
- Admin crea usuarios (fisio/socio)
- Email + contraseña auto-generada (reactive.fisio1, etc.)

### 2. ✅ Registro de pacientes
- Admin carga: nombre, apellido, lesión, sesiones compradas
- Los fisios seleccionan de lista al registrar

### 3. ✅ Formulario de sesiones
- Tipo: Clínica / Domicilio A / Domicilio B
- Si clínica → horarios; si domicilio → sin horarios
- Observaciones opcionales

### 4. ✅ Dashboard admin
- Ve todos los registros
- Calcula automático:
  - Fisio: $250/paciente (3+ en la hora = $450)
  - Socio: $350/paciente (sin límite)
  - Domicilio A: +$700
  - Domicilio B: +$1000
- Control de sesiones compradas

### 5. ✅ Comprobantes
- Admin sube PDF/imagen de comprobante
- Sistema envía email automático con Resend
- Historial de envíos

## URLs del Panel (en preview)

| Página | URL |
|--------|-----|
| Login | `/panel-pagos` |
| Registro (fisio) | `/panel-pagos/registro` |
| Dashboard admin | `/panel-pagos/admin` |
| Crear usuarios | `/panel-pagos/admin/usuarios` |
| Gestionar pacientes | `/panel-pagos/admin/pacientes` |
| Comprobantes | `/panel-pagos/admin/comprobantes` |

## Credenciales de Demo

```
Admin:    reactive.admin@clinic.com / reactive.admin1
Fisio:    ariel@reactive.com / reactive.fisio1
Socio:    carlos@reactive.com / reactive.socio1
```

## Storage de Archivos (Próximo paso)

Para guardar PDFs de comprobantes:
1. En Supabase → Storage
2. Crear bucket: `comprobantes`
3. Configurar políticas de acceso

## Seguridad

- Cada usuario ve solo sus datos (con Row Level Security)
- Contraseñas guardadas en BD (hashear en producción)
- Emails enviados con Resend (verificado)
- No visible en tu sitio público (apartado extra)

## Próximas mejoras

- [ ] Validar sesiones disponibles antes de registrar
- [ ] Genera automáticamente resumen mensual
- [ ] Notificaciones cuando falten sesiones
- [ ] Exportar reportes a Excel
- [ ] Dashboard gráfico de ingresos
