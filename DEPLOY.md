# Guía de despliegue — fisiotips.com

Esta guía asume que vas a hacer los pasos vos mismo (o conmigo guiándote en el chat paso a paso). Ninguna clave ni credencial se comparte acá — todo se carga directamente en los paneles de cada servicio.

## 0. Requisitos antes de empezar

- Cuenta de GitHub (gratis) — para alojar el código y conectarlo a Vercel.
- Cuenta de Vercel (gratis) — donde va a "vivir" el sitio.
- Cuenta de Resend (gratis hasta cierto volumen) — para el envío de emails.
- Tu cuenta de Mercado Pago con credenciales de API (ya la tenés).
- Acceso al panel de DNS de GoDaddy para `fisiotips.com` (el link que ya usás: `dcc.godaddy.com/control/portfolio/fisiotips.com/settings`).

## 1. Subir el código a GitHub

1. Creá un repositorio nuevo y privado en GitHub, por ejemplo `fisiotips-web`.
2. Desde esta carpeta (`fisiotips-web`), corré:
   ```
   git init
   git add .
   git commit -m "Sitio inicial fisiotips.com"
   git branch -M main
   git remote add origin <URL_DE_TU_REPO>
   git push -u origin main
   ```

## 2. Mercado Pago — credenciales

1. Entrá a tu panel de desarrolladores de Mercado Pago (`mercadopago.com.uy/developers/panel` o `.com.ar` según tu cuenta).
2. Elegí tu aplicación (o creá una nueva) y copiá el **Access Token** de producción.
3. Importante: confirmá en esa misma sección qué `currency_id` soporta tu cuenta (en Uruguay generalmente `UYU`, en Argentina `ARS`). El sitio muestra el precio en dólares como referencia (`content/site-copy.ts`), pero el cobro real en Mercado Pago tiene que usar la moneda que tu cuenta admite — avisame cuál es y ajusto `consulta.moneda` en ese archivo.
4. Probá primero con las **credenciales de prueba** (test) y usuarios de prueba antes de pasar a producción, para simular un pago sin cobrar de verdad.

## 3. Resend — envío de emails

1. Creá una cuenta en `resend.com`.
2. En "API Keys", generá una y guardala para el paso 5.
3. (Recomendado, no obligatorio al principio) Para que los emails no lleguen a spam, verificá el dominio `fisiotips.com` en Resend: te va a pedir agregar unos registros DNS (TXT/CNAME) — se agregan en el mismo panel de DNS de GoDaddy que vas a usar en el paso 6.
4. Mientras no verifiques el dominio, podés usar el remitente por defecto `onboarding@resend.dev` (ya configurado en `.env.example`), que funciona pero puede caer en spam ocasionalmente.

## 4. Crear el proyecto en Vercel

1. Entrá a `vercel.com`, iniciá sesión con GitHub.
2. "Add New Project" → elegí el repo `fisiotips-web`.
3. Framework: Vercel detecta Next.js automáticamente. No hace falta cambiar nada.
4. Antes de darle "Deploy", andá a "Environment Variables" y cargá las mismas variables de `.env.example`:
   - `MP_ACCESS_TOKEN`
   - `RESEND_API_KEY`
   - `RESEND_FROM`
   - `NOTIFY_EMAIL` (`jcazenave12@gmail.com`)
   - `SITE_URL` → poné `https://fisiotips.com` (aunque el dominio todavía no esté conectado, ya lo dejás preparado)
   - `MP_WEBHOOK_URL` → `https://fisiotips.com/api/mp-webhook`
5. Deploy. Vercel te da una URL temporaria tipo `fisiotips-web.vercel.app` para probar todo antes de conectar el dominio.

## 5. Conectar el dominio fisiotips.com (GoDaddy → Vercel)

1. En el proyecto de Vercel, andá a "Settings" → "Domains" y agregá `fisiotips.com` y `www.fisiotips.com`.
2. Vercel te va a mostrar los registros DNS exactos a usar (pueden variar, pero típicamente):
   - Un registro `A` para `@` apuntando a `76.76.21.21`
   - Un registro `CNAME` para `www` apuntando a `cname.vercel-dns.com`
3. Andá a tu panel de GoDaddy (`dcc.godaddy.com/control/portfolio/fisiotips.com/settings` → sección DNS) y agregá/editá esos registros con los valores exactos que te mostró Vercel.
4. Esto va a desconectar el dominio del WordPress gestionado de GoDaddy que tenías configurado (el de `1210479.us16.myftpupload.com`) — ya no lo vas a usar, así que no pasa nada, pero tenelo en cuenta antes de confirmar el cambio.
5. Esperá la propagación (minutos a un par de horas). Vercel emite el certificado HTTPS automáticamente.

## 6. Probar todo el flujo antes de anunciar el sitio

1. Entrá al sitio ya en `fisiotips.com`, completá el formulario de consulta con datos de prueba y un archivo de prueba.
2. Confirmá que te llegó el email a `jcazenave12@gmail.com`.
3. Completá el pago con un usuario de prueba de Mercado Pago (mientras uses credenciales de test) y confirmá que llega el segundo email de "pago confirmado".
4. Recién ahí, cambiá `MP_ACCESS_TOKEN` en Vercel por el de producción y volvé a probar con un monto real bajo si querés estar 100% seguro.

## 7. Contenido pendiente de tu parte

Antes de publicar, reemplazá los placeholders marcados con `// TODO` en:

- `content/site-copy.ts`: número de WhatsApp, Instagram, fotos (`/images/...`), precio final, estadísticas reales.
- `content/videos.ts`: títulos y links reales de tus videos (recomendado: subilos como "no listados" a YouTube y pegá el link en formato `https://www.youtube.com/embed/ID_DEL_VIDEO`).
- Las fotos van en la carpeta `public/images/` con esos mismos nombres de archivo (o cambiá el nombre en `site-copy.ts`).

Cuando tengas todo eso, avisame y seguimos juntos con la conexión de cuentas paso a paso.
