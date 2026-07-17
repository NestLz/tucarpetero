# TuCarpetero.com

Marketplace de carpeteros — cartas TCG (Pokémon, Yu-Gi-Oh, Magic) en Lima, Perú.

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Docker

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/` | Búsqueda con filtros (juego, expansión, rareza, condición, precio, idioma, entrega, verificados), autocompletado y orden |
| `/carta/[id]` | Ficha de carta: precio de mercado / más bajo / última venta, historial de ventas, disponibilidad, ofertas de carpeteros con detalle expandible (fotos, notas del vendedor, política de entrega) |
| `/condiciones` | Guía visual de las 5 condiciones estándar (Near Mint → Dañada) |
| `/subastas` | Subasta en vivo (pujar, compra ya, anti-sniping) + lista |
| `/carrito` | Carrito agrupado por vendedor, cantidades y subtotal |
| `/checkout` | Flujo de pago en 3 pasos: entrega por vendedor → método de pago (mock) → confirmación con número de orden |
| `/chat` | Chat interno comprador ↔ carpetero, ligado a cada carta |
| `/favoritos` | Cartas guardadas con su precio de mercado actual |
| `/perfil/[user]` | Perfil de carpetero: reputación, carpetas, reseñas |

## Datos

Todo vive en `lib/data.js`, con dos fuentes:

- **Catálogo real**: cartas de Pokémon (pokemontcg.io) y Yu-Gi-Oh (YGOPRODeck) — nombre, set,
  rareza, imagen y precio de referencia real. Se traen con:
  ```bash
  node scripts/fetch-pokemon-cards.mjs
  node scripts/fetch-yugioh-cards.mjs
  ```
  Magic sigue siendo data de ejemplo hasta integrar Scryfall.
- **Precios y ofertas generados**: historial de ventas, precio de mercado, y las ofertas de
  cada carpetero (condición, idioma, stock, fotos) se derivan de forma determinística por
  carta (sembrado con su `id`) — no son aleatorios en cada carga, pero tampoco son datos
  reales de ventas.

Estado (carrito, favoritos) se persiste en `localStorage` vía `CartContext` /
`FavoritesContext` en `components/`.

## Requisitos

- Docker Desktop instalado y corriendo

## Levantar en local

```bash
cd tucarpetero
docker compose up --build
```

Abre **http://localhost:9090**. El hot reload está activo: edita cualquier archivo y el
navegador se actualiza solo.

Para detener: `Ctrl+C` y luego `docker compose down`.

## Editar

- **Diseño / tokens**: `app/globals.css` (colores, fuentes, clases `.holo`)
- **Datos, precios, condiciones**: `lib/data.js`
- **Navegación**: `components/Nav.jsx` (barra inferior en mobile, header en desktop)
- **Carrito / favoritos**: `components/CartContext.jsx`, `components/FavoritesContext.jsx`
- **Componentes compartidos**: `components/ui.jsx`

## Próximas fases (no incluidas aún)

- Autenticación de usuarios y publicación real de ofertas
- Base de datos (Postgres/Supabase) en lugar de `lib/data.js`
- Catálogo real de Magic vía Scryfall
- Integración real de pagos con Culqi (hoy `/checkout` es solo UI simulada — buscar
  `// TODO: integrar Culqi` en `app/checkout/page.jsx`) y escrow real en backend
- Subastas en tiempo real (WebSockets) + notificaciones WhatsApp
- Flujo de sellado en tienda certificadora (fotos con timestamp + código real, hoy
  simulado en el detalle expandible de cada oferta)
- Fotos reales subidas por el vendedor (hoy son placeholders en `/carta/[id]`)

## Comandos Docker de referencia

```bash
# levantar (reconstruyendo la imagen)
docker compose up --build

# levantar en segundo plano
docker compose up -d --build

# ver logs si corre en segundo plano
docker compose logs -f web

# correr el build de producción dentro del contenedor (verificación, no reemplaza el dev server)
docker compose exec web npm run build

# reiniciar el contenedor (necesario después de un build de producción,
# porque pisa la carpeta .next que usa el servidor de desarrollo)
docker compose restart web

# detener y limpiar contenedores
docker compose down

# reconstruir desde cero si algo se rompe (borra caché)
docker compose build --no-cache && docker compose up
```
