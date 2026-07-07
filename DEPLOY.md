# Guía de despliegue — fisiotips.com

## Estado actual

- El sitio ya está desplegado en Vercel (cuenta `fisiotipss`), en `https://fisiotips-web.vercel.app`.
- El pago de la evaluación usa tu **Link de pago de Mercado Pago** fijo (`content/site-copy.ts` → `consulta.mercadoPagoLink`), no una integración por API. Si en el futuro querés cobrar distintos montos dinámicamente, se puede migrar a la API de Mercado Pago con tu Access Token.
- El dominio `fisiotips.com` se está conectando (ver paso 2).

## 1. Resend — envío de emails (pendiente)

El formulario de evaluación ya envía un email a `jcazenave12@gmail.com` con los datos del paciente, pero necesita una API key de Resend para funcionar en producción:

1. Creá una cuenta gratis en `resend.com`.
2. En "API Keys", generá una.
3. Agregala en Vercel: Project Settings → Environment Variables → `RESEND_API_KEY`.
4. (Recomendado, no obligatorio al principio) Para que los emails no lleguen a spam, verificá el dominio `fisiotips.com` en Resend — te va a pedir agregar registros DNS (TXT/CNAME) en el mismo panel de GoDaddy del paso 2. Mientras no lo verifiques, el remitente por defecto (`onboarding@resend.dev`) funciona igual.

## 2. Conectar el dominio fisiotips.com (GoDaddy → Vercel)

1. En el proyecto de Vercel (Settings → Domains) se agrega `fisiotips.com` y `www.fisiotips.com`.
2. Vercel entrega los registros DNS exactos a usar (típicamente un `A` en `@` → `76.76.21.21` y un `CNAME` en `www` → `cname.vercel-dns.com`).
3. Esos registros se cargan en el panel de DNS de GoDaddy (`dcc.godaddy.com/control/portfolio/fisiotips.com/settings`).
4. Esto reemplaza la configuración anterior del WordPress gestionado de GoDaddy (`1210479.us16.myftpupload.com`), que ya no se usa.
5. La propagación puede tardar de minutos a un par de horas. Vercel emite el certificado HTTPS automáticamente.

## 3. Probar el flujo completo

1. Entrar al sitio, completar el formulario de evaluación con datos de prueba y un archivo de prueba.
2. Confirmar que llega el email a `jcazenave12@gmail.com` (una vez cargada la API key de Resend).
3. Confirmar que al enviar el formulario redirige correctamente al link de pago de Mercado Pago.

## 4. Contenido pendiente

- `content/site-copy.ts`: Instagram, WhatsApp, fotos, precio y link de pago — ya cargados.
- `content/videos.ts`: títulos y videos de casos de éxito — ya cargados (miniaturas reales guardadas en `public/images/`).
- Confirmar el texto final de "Sobre mí", números y estadísticas cuando quieras ajustarlos.
