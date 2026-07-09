# 🚀 Guía Rápida para Editar Fisiotips.com

## Información Esencial

- **Sitio web:** https://fisiotips.com
- **Repositorio:** https://github.com/fisiotipss/fisiotips-web
- **Hosting:** Vercel (vercel.com)
- **Framework:** Next.js 16 (React)
- **Email del propietario:** jcazenave12@gmail.com
- **Usuario GitHub:** fisiotipss

---

## Flujo de Trabajo (Paso a Paso)

### 1️⃣ Editar el Código

La carpeta principal está en:
```
C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web
```

**Archivos principales:**
- `app/page.tsx` - Página de inicio (estructura)
- `components/` - Componentes reutilizables
  - `ReservaForm.tsx` - Formulario de consulta/evaluación
  - `Nav.tsx` - Navegación
  - `Hero.tsx` - Sección hero
  - Otros componentes...
- `content/site-copy.ts` - Textos y contenido del sitio

### 2️⃣ Hacer Cambios

Edita los archivos necesarios en la carpeta `fisiotips-web/`

Ejemplo:
```bash
# Editar formulario
C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web\components\ReservaForm.tsx
```

### 3️⃣ Verificar que Funciona

```bash
cd "C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web"
npm run build
```

Si no hay errores, está bien.

### 4️⃣ Publicar en Producción

**Opción A - Directo con Vercel (recomendado):**
```bash
cd "C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web"
vercel --prod
```

**Opción B - Con GitHub (auto-deploy):**
```bash
cd "C:\Users\lapto\OneDrive\Escritorio\Cloud ig\fisiotips-web"
git add .
git commit -m "Descripción del cambio"
git push
```

---

## Estructura del Formulario de Evaluación

El formulario en `ReservaForm.tsx` incluye estos campos **obligatorios**:

1. ✓ Nombre completo
2. ✓ Edad
3. ✓ Deporte que realiza
4. ✓ Ciudad/país
5. ✓ Esfuerzo físico (select con 3 opciones)
6. ✓ Sucursal (select con ubicaciones)
7. ✓ **Preferencia horaria** (select: Mañana / Tarde / Ambas)
8. ✓ Motivo de consulta (textarea)

Campos opcionales:
- Teléfono de emergencia
- Tratamientos previos (textarea)
- Estudios médicos (archivo PDF/JPG)

---

## Detalles Técnicos

### Stack
- **Framework:** Next.js 16 (TypeScript)
- **CSS:** Tailwind + CSS Modules
- **Pago:** Mercado Pago (integración en API)
- **Base de Datos:** Supabase (API)
- **Deploy:** Vercel
- **Versionado:** GitHub

### Variables de Entorno (si necesitas)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
MERCADO_PAGO_ACCESS_TOKEN=...
```

### Rutas Principales
- `/` - Página de inicio
- `/gracias` - Página de agradecimiento (después de pago)
- `/pago-fallido` - Página si falla el pago
- `/api/consulta` - Endpoint para procesar formulario
- `/api/mp-webhook` - Webhook de Mercado Pago

---

## Comandos Útiles

```bash
# Ver cambios locales
git status

# Ver diferencias
git diff

# Ver historial
git log --oneline

# Descargar cambios de GitHub
git pull

# Revertir cambios (cuidado!)
git checkout -- components/ReservaForm.tsx
```

---

## Contacto & Credenciales

- **GitHub:** fisiotipss
- **Vercel:** Vinculada a fisiotipss
- **Email:** jcazenave12@gmail.com
- **Token GitHub:** (regenerado después de cada uso por seguridad)

---

## Última Actualización

- **Fecha:** 2026-07-09
- **Cambio:** Agregado campo "Preferencia horaria" obligatorio en formulario
- **Estado:** ✅ En producción (fisiotips.com)
