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

1. Entra en [vercel.com](https://vercel.com) e inicia sesión (con GitHub si quieres).
2. Clic en **Add New** → **Project**.
3. **Import** el repositorio de GitHub (elige `estatica` o el nombre que le hayas puesto).
4. Vercel detectará el proyecto. No cambies nada:
   - **Build Command:** `npm run build:static` (lo toma de `vercel.json`)
   - **Output Directory:** `dist`
5. Clic en **Deploy**.
6. Cuando termine, tendrás una URL tipo: `https://estatica-xxxx.vercel.app`.

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

## Resumen de archivos añadidos para el despliegue

- **vercel.json:** indica a Vercel que use `build:static` y que la raíz muestre la página de inicio.
- **package.json:** script `build:static` que copia `public/` a `dist/`.
- **scripts/copy-public.mjs:** script que hace la copia de `public` a `dist`.
