# Lista de exploradores compartida (opcional)

GitHub Pages solo sirve archivos estáticos, así que no puede guardar datos. Para que todos vean la misma lista usamos **Supabase** (PostgreSQL gratuito) llamado por `fetch`, sin librerías. Si no lo configuras, la app sigue funcionando y guarda la lista solo en el navegador de cada persona.

## Pasos

1. Crea una cuenta en https://supabase.com y un proyecto nuevo (plan Free).
2. Abre el **SQL Editor**, pega el contenido de `db/schema.sql` y ejecútalo. Crea la tabla `explorers` con seguridad por filas: el público solo puede leer filas visibles y agregar filas; no puede editar ni borrar.
3. En los ajustes del proyecto, en la sección de API, copia la **Project URL** y la clave pública (anon o publishable).
4. Pégalas en `js/config.js`:
   ```js
   const EVTRON_DB={url:'https://TU-PROYECTO.supabase.co',key:'TU_CLAVE_PUBLICA'};
   ```
5. Haz commit y push. GitHub Pages / GitLab Pages publican el cambio.
6. Verifica: abre el sitio, escribe un apodo, termina una historia y comprueba que aparece en *Table Editor → explorers*.

## Evitar que el proyecto se pause

El plan gratuito pausa los proyectos tras 7 días sin actividad. En GitHub: *Settings → Secrets and variables → Actions → New repository secret* y crea `SUPABASE_URL` y `SUPABASE_KEY` (la misma clave pública). El workflow `.github/workflows/keepalive.yml` hace una consulta cada 3 días. GitHub puede desactivar workflows programados si el repositorio queda sin actividad por mucho tiempo; si pasa, actívalo de nuevo desde la pestaña *Actions*.

## Seguridad y privacidad

- La clave `anon`/publishable **es pública por diseño**; la protegen las políticas de `db/schema.sql`. Nunca pongas la clave `service_role` en el código.
- Cualquiera puede agregar apodos, así que modera: en *Table Editor → explorers* cambia `hidden` a `true` y el apodo deja de mostrarse. La tabla ya rechaza apodos de más de 16 caracteres y los que parecen enlaces o correos.
- La app pide un **apodo**, no el nombre completo. Si la usas con menores, sigue las reglas de protección de datos de tu país o escuela y evita recoger datos personales.
- Cada historia completada agrega una fila; con la lista mostrada (10 por misión) el tamaño de la base seguirá siendo mínimo.
