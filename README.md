# TuCarpetero.com

Marketplace de carpeteros — cartas TCG (Pokémon, Yu-Gi-Oh, Magic) en Lima, Perú.

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Docker

## Pantallas incluidas (MVP con data de ejemplo)

| Ruta | Pantalla |
|---|---|
| `/` | Búsqueda global con filtro por TCG |
| `/carta/[id]` | Ficha de carta multi-vendedor + historial de precios |
| `/subastas` | Subasta en vivo (pujar, compra ya, anti-sniping) + lista |
| `/chat` | Chat interno comprador ↔ carpetero, ligado a cada carta |
| `/perfil/[user]` | Perfil de carpetero: reputación, carpetas, reseñas |

Los datos viven en `lib/data.js` — reemplazar por base de datos real en fase 2.

## Requisitos

- Docker Desktop para Mac instalado y corriendo
- Cuenta de GitHub

## 1. Crear el repositorio en GitHub

```bash
cd tucarpetero
git init
git add .
git commit -m "MVP inicial: búsqueda, ficha, subastas, chat, perfil"
```

Luego crea el repo vacío en github.com (botón **New repository**, nombre
`tucarpetero`, **sin** README ni .gitignore) y conéctalo:

```bash
git remote add origin git@github.com:TU_USUARIO/tucarpetero.git
git branch -M main
git push -u origin main
```

> Si usas HTTPS en vez de SSH:
> `git remote add origin https://github.com/TU_USUARIO/tucarpetero.git`

## 2. Levantar en local con Docker

```bash
docker compose up --build
```

Abre **http://localhost:9090**. El hot reload está activo: edita cualquier
archivo y el navegador se actualiza solo.

Para detener: `Ctrl+C` y luego `docker compose down`.

## 3. Editar

- **Diseño / tokens**: `app/globals.css` (colores, fuentes, clases `.holo`)
- **Datos de ejemplo**: `lib/data.js`
- **Navegación inferior**: `components/Nav.jsx`
- **Componentes compartidos**: `components/ui.jsx`

## Próximas fases (no incluidas aún)

- Autenticación de usuarios y publicación real de ofertas
- Base de datos (Postgres/Supabase) en lugar de `lib/data.js`
- Catálogo real vía APIs: Scryfall (Magic), pokemontcg.io, YGOPRODeck
- Pagos con Culqi + escrow (retención hasta confirmar recepción)
- Subastas en tiempo real (WebSockets) + notificaciones WhatsApp
- Flujo de sellado en tienda certificadora (fotos con timestamp + código)

## Comandos Docker de referencia

```bash
# levantar (reconstruyendo la imagen)
docker compose up --build

# levantar en segundo plano
docker compose up -d --build

# ver logs si corre en segundo plano
docker compose logs -f web

# detener y limpiar contenedores
docker compose down

# reconstruir desde cero si algo se rompe (borra caché)
docker compose build --no-cache && docker compose up
```
