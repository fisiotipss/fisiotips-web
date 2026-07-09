# Panel de Pagos ReActive - Prompt para Continuar

## Contexto
Hemos construido un **Panel de Pagos independiente** integrado en fisiotips.com (mismo hosting/dominio, sin afectar el sitio público). Sistema para gestionar pagos de fisios y socios basado en sesiones atendidas.

## ¿Qué se hizo?
✅ Sistema completo de login/registro/pagos
✅ Gestión de pacientes, usuarios, sesiones y comprobantes
✅ Cálculos automáticos de pagos (fisios $250/paciente, socios $350, domicilios +700/+1000)
✅ Envío de comprobantes por email (Resend)
✅ API endpoints listos
✅ Cliente Supabase integrado (BD lista para configurar)
✅ Publicado en producción (https://fisiotips.com/panel-pagos)

## URLs en Producción
- Login: `https://fisiotips.com/panel-pagos`
- Registro de sesiones: `https://fisiotips.com/panel-pagos/registro`
- Dashboard admin: `https://fisiotips.com/panel-pagos/admin`
- Crear usuarios: `https://fisiotips.com/panel-pagos/admin/usuarios`
- Pacientes: `https://fisiotips.com/panel-pagos/admin/pacientes`
- Comprobantes: `https://fisiotips.com/panel-pagos/admin/comprobantes`

## Cómo Funciona
**Admin (Joaquín):**
1. Crea usuarios: email + rol (fisio/socio) → contraseña auto-generada (reactive.fisio1, etc.)
2. Carga pacientes: nombre, apellido, lesión, sesiones compradas
3. Ve dashboard: todos los registros, cálculos automáticos de pagos por mes
4. Sube comprobantes: sistema envía email automático al fisio

**Fisio/Socio:**
1. Login con email + contraseña asignada
2. Registra sesiones: fecha, paciente, tipo (clínica/domicilio A/B), horarios, observaciones
3. Recibe comprobante por email

## Estructura del Código
```
app/panel-pagos/                    # Rutas del panel
├── page.tsx                        # Login
├── layout.tsx                      # Layout
├── registro/page.tsx               # Formulario registro (fisio)
└── admin/
    ├── page.tsx                    # Dashboard
    ├── usuarios/page.tsx           # Crear usuarios
    ├── pacientes/page.tsx          # Gestionar pacientes
    └── comprobantes/page.tsx       # Upload comprobantes

app/api/panel-pagos/                # API endpoints
├── login/route.ts                  # Validar login
├── registros/route.ts              # Guardar sesiones
└── comprobantes/
    ├── upload/route.ts             # Upload PDF
    └── enviar/route.ts             # Enviar email

lib/supabase.ts                     # Cliente BD (Supabase)
docs/PANEL-PAGOS-SETUP.md           # Instrucciones configuración
```

## Próximos Pasos Disponibles

### 1. Configurar BD Real (Supabase)
Ver `docs/PANEL-PAGOS-SETUP.md` → crear proyecto, obtener credenciales, agregar `.env.local`

### 2. Mejoras de Validación
- Validar sesiones disponibles antes de registrar
- Alertas cuando faltan sesiones
- Bloquear registro si no hay sesiones

### 3. Reportes y Exportación
- Generar resumen mensual automático
- Exportar a Excel
- Gráficos de ingresos/sesiones

### 4. Mejoras UI
- Dashboard gráfico (charts)
- Filtros avanzados por mes/sucursal
- Búsqueda de pacientes
- Historial de modificaciones

### 5. Validaciones Avanzadas
- Horario máximo por día
- Detección de solapamiento de sesiones
- Control de sucursales (Lagomar/Shangrila)
- Número de cuenta para pagos

### 6. Seguridad
- Row Level Security (RLS) en Supabase
- Hash de contraseñas
- Auditoría de cambios
- Recuperación de contraseña

## Stack Técnico
- **Frontend:** Next.js 16, React, Tailwind CSS, TypeScript
- **Backend:** Next.js API Routes
- **BD:** Supabase (PostgreSQL) - lista para configurar
- **Emails:** Resend (ya integrado)
- **Auth:** Session con localStorage (mock - mejorar con JWT/Supabase)
- **Hosting:** Vercel (fisiotips.com)
- **Versionado:** GitHub

## Datos Actuales
**Estado:** Vacío (con datos de demo que desaparecen al recargar)
**Próximo:** Admin crea usuarios reales con emails de fisios/socios

**Contraseñas auto-generadas:**
- Fisios: `reactive.fisio1`, `reactive.fisio2`, etc.
- Socios: `reactive.socio1`, `reactive.socio2`, etc.
- Admin: `reactive.admin1`

## Importante
- ⚠️ No afecta fisiotips.com (sitio público intacto)
- ⚠️ Requiere Supabase para persistencia de datos
- ⚠️ Botón "Acceso usuario" es discreto (texto negro sin reborde)
- ⚠️ Todos los cálculos de pagos son automáticos (validar fórmulas)

## Comandos Útiles
```bash
# Ver cambios
git status

# Desarrollo local
npm run dev

# Build
npm run build

# Push a producción
git push

# Ver logs de Vercel
vercel logs
```

## Contactos
- Repo: https://github.com/fisiotipss/fisiotips-web
- Dominio: https://fisiotips.com
- Email: jcazenave12@gmail.com
- Panel: https://fisiotips.com/panel-pagos

## Para Continuar
Cuando quieras seguir, puedes pedirme:
1. "Configura Supabase en el panel"
2. "Mejora la validación de sesiones"
3. "Agrega gráficos al dashboard"
4. "Implementa filtros por mes/sucursal"
5. Cualquier otro cambio específico

Solo pasa este prompt y continuamos donde se dejó.
