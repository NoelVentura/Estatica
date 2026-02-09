# Desplegar en GitHub y Vercel

## 1. Subir el proyecto a GitHub

### Si aún no tienes un repositorio en GitHub

1. Entra en [github.com](https://github.com) y crea un **nuevo repositorio** (New repository).
2. Nombre sugerido: `estatica` o `estatica-ingenieros`.
3. No marques "Add a README" si ya tienes archivos en tu carpeta local.
4. Crea el repositorio.

### Desde la carpeta del proyecto (PowerShell o CMD)

```powershell
cd "c:\Users\nwpv7\OneDrive\Escritorio\CURSOR\Proyectos\Estatica\estatica"

# Si es la primera vez (git no inicializado)
git init
git add .
git commit -m "Sitio Estática para Ingenieros - listo para Vercel"

# Añade tu repositorio (sustituye TU_USUARIO y TU_REPO por los tuyos)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Sube el código (rama main)
git branch -M main
git push -u origin main
```

### Si ya tienes git y solo quieres actualizar

```powershell
git add .
git commit -m "Configuración para Vercel y despliegue"
git push
```

---

## 2. Conectar con Vercel

1. Entra en [vercel.com](https://vercel.com) e inicia sesión (con GitHub es lo más fácil).
2. Clic en **Add New** → **Project**.
3. **Import** el repositorio de GitHub: busca **NoelVentura/Estatica** (o el nombre de tu repo) y conéctalo.
4. Vercel leerá `vercel.json`. Comprueba que aparezca:
   - **Build Command:** `npm run build:static`
   - **Output Directory:** `dist`
   - **Root Directory:** (dejar vacío o `.`)
5. Clic en **Deploy**.
6. En 1–2 minutos tendrás una URL como: `https://estatica-xxxx.vercel.app` (o el nombre que elijas).
7. Cada **push a `main`** en GitHub desplegará automáticamente en Vercel.

### Comportamiento del sitio

- La **raíz** (`/`) redirige a la página de inicio (`/Pagina de inicio.html`).
- Las páginas están en: `/Pagina de inicio.html`, `/Libros.html`, `/Inscribir curso.html`, `/Contacto.html`.

---

## 3. Actualizar el formulario de inscripción (opcional)

Cuando tengas la URL de Vercel (ej: `https://estatica.vercel.app`), en **Google Apps Script** (Code.gs) puedes poner:

```js
const URL_PAGINA_INICIO = 'https://tu-proyecto.vercel.app/';
```

Así, después de registrarse, se redirigirá a tu sitio en línea en lugar de localhost.

---

---

## 4. GitHub Pages (si usas GitHub para publicar el sitio)

El proyecto **no usa Jekyll**; se construye con Node (`npm run build:static`). Para que GitHub Pages no intente usar Jekyll ni busque la carpeta `docs/`, debes usar el workflow de GitHub Actions.

### Paso obligatorio: cambiar el origen de Pages

1. En GitHub, abre tu repositorio.
2. Ve a **Settings** → **Pages** (menú izquierdo, en "Code and automation").
3. En **Build and deployment** → **Source**, selecciona **"GitHub Actions"** (no "Deploy from a branch").
4. Guarda si hace falta.

Si dejas "Deploy from a branch", GitHub seguirá ejecutando Jekyll y dará errores como:
- `YAML Exception` en archivos `.astro`
- `No such file or directory - /github/workspace/docs`

### Después de cambiar a GitHub Actions

- Cada vez que hagas **push a `main`** (o `master`), se ejecutará el workflow **"Deploy to GitHub Pages"**.
- En la pestaña **Actions** verás el estado; cuando termine en verde, el sitio estará en `https://<usuario>.github.io/<repo>/`.
- La primera vez puede que tengas que crear el environment **github-pages** (GitHub lo suele crear al elegir "GitHub Actions" como source).

---

## Resumen de archivos añadidos para el despliegue

- **vercel.json:** indica a Vercel que use `build:static` y que la raíz muestre la página de inicio.
- **package.json:** script `build:static` que copia `public/` a `dist/`.
- **scripts/copy-public.mjs:** script que hace la copia de `public` a `dist` y añade `.nojekyll`.
- **.github/workflows/deploy-pages.yml:** workflow que construye con Node y despliega la carpeta `dist` en GitHub Pages.
