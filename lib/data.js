// ─── Datos de ejemplo del MVP ────────────────────────────────
// Reemplazar por base de datos real (Postgres/Supabase) en fase 2.
//
// Las cartas de Pokémon (pokemontcg.io, ver scripts/fetch-pokemon-cards.mjs)
// y Yu-Gi-Oh (YGOPRODeck, ver scripts/fetch-yugioh-cards.mjs) son reales:
// nombre, set, rareza, precio de referencia e imagen. Magic sigue siendo
// datos de ejemplo hasta integrar Scryfall.
import POKEMON_CARDS from "./pokemon-cards.json";
import YUGIOH_CARDS from "./yugioh-cards.json";

export const TCG_COLORS = {
  "Pokémon": "#F4B63F",
  "Yu-Gi-Oh": "#B85CDB",
  "Magic": "#E2703A",
};

export const CARDS = [
  ...POKEMON_CARDS,
  ...YUGIOH_CARDS,
  { id: "3", tcg: "Magic", name: "Sol Ring", set: "Commander Masters", num: "464", rarity: "Uncommon", refUsd: 2.8, img: "💍" },
  { id: "4", tcg: "Magic", name: "Ragavan, Nimble Pilferer", set: "Modern Horizons 2", num: "138", rarity: "Mythic", refUsd: 38.0, img: "🐒" },
];

// "ago 2024" a partir de una fecha "2024/08/02" de la API
export const setDateLabel = (releaseDate) => {
  if (!releaseDate) return "";
  const d = new Date(releaseDate.replace(/\//g, "-"));
  return d.toLocaleDateString("es-PE", { month: "short", year: "numeric" });
};

// Deriva la lista de expansiones (más reciente primero) presentes en un
// pool de cartas, para el filtro por expansión en /
const setsFromPool = (pool) =>
  Array.from(
    new Map(pool.map((c) => [c.setId, { id: c.setId, name: c.set, releaseDate: c.setReleaseDate }])).values()
  ).sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1));

export const POKEMON_SETS = setsFromPool(POKEMON_CARDS);
export const YUGIOH_SETS = setsFromPool(YUGIOH_CARDS);

// Expansiones disponibles por TCG, para el panel de filtros en /
export const SETS_BY_TCG = {
  "Pokémon": POKEMON_SETS,
  "Yu-Gi-Oh": YUGIOH_SETS,
};

// Plantilla de vendedores: reputación, verificación y tipo de entrega son
// atributos DEL VENDEDOR (fijos, no cambian carta a carta). La condición,
// idioma, cantidad y precio de cada listado sí varían por carta — ver
// offersFor, que las deriva de forma sembrada (determinística) por carta.
const SELLER_TEMPLATE = [
  { seller: "BinderSJM", rep: 4.2, sales: 23, verified: false, delivery: ["coordinar"], priceFactor: 0.94 },
  { seller: "DracoLima", rep: 4.6, sales: 64, verified: false, delivery: ["coordinar"], priceFactor: 0.98 },
  { seller: "KensoTCG", rep: 4.9, sales: 212, verified: true, delivery: ["tienda", "coordinar"], priceFactor: 1.0 },
  { seller: "CarpetaMiraflores", rep: 4.8, sales: 147, verified: true, delivery: ["tienda"], priceFactor: 1.03 },
  { seller: "PokeAndrés", rep: 4.9, sales: 301, verified: true, delivery: ["tienda", "coordinar"], priceFactor: 1.08 },
];

// Roster de vendedores — se usa solo para .length (conteo genérico de
// "ofertas" en el grid de /); las ofertas reales de cada carta salen de
// offersFor(card), que varía por carta.
export const DEFAULT_OFFERS = SELLER_TEMPLATE;

// ─── Precios estilo TCGplayer ────────────────────────────────
// No tenemos historial de ventas real por carta (las APIs de origen solo
// dan el precio actual), así que generamos uno plausible y ESTABLE por
// carta (sembrado con su id) en vez de reciclar un único array para las
// 131 cartas como se hacía antes.
function seedFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

function mulberry32(seed) {
  let s = seed;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// historial de ventas en soles, más reciente al final
export function priceHistoryFor(card, points = 12) {
  const base = Math.max(2, Math.round(card.refUsd * 0.8 * 3.75));
  const rand = mulberry32(seedFromId(card.id));
  const history = [];
  let prev = base;
  for (let i = 0; i < points; i++) {
    const driftToBase = (base - prev) * 0.15;
    const noise = (rand() - 0.5) * base * 0.18;
    prev = Math.max(2, Math.round(prev + driftToBase + noise));
    history.push(prev);
  }
  return history;
}

// Precio de Mercado: promedio de las últimas ventas en la plataforma
export function marketPriceOf(card) {
  const history = priceHistoryFor(card);
  const recent = history.slice(-6);
  return Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);
}

// Última venta registrada
export function lastSaleOf(card) {
  const history = priceHistoryFor(card);
  return history[history.length - 1];
}

function weightedPick(rand, items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// Distribución realista: la mayoría de listados están en buen estado.
const CONDITION_WEIGHTS = [40, 25, 20, 10, 5]; // NM, LP, MP, HP, Dañada
const LANGS = ["Inglés", "Español"];
const LANG_WEIGHTS = [72, 28]; // la mayoría del stock importado viene en inglés

const SELLER_NOTES = [
  "Carta guardada en funda rígida desde que la compré, nunca sale del binder.",
  "Fotografiada con luz natural, sin filtros ni edición. Lo que ves es lo que hay.",
  "Recién la revisé con lupa antes de publicarla: sin doblez ni marcas nuevas.",
  "Viene con sleeve nuevo incluido para el envío o la entrega en tienda.",
  "Comprada directa en tienda oficial — conservo el ticket de compra.",
  "Parte de una colección personal, muy poco manoseada.",
];

// Ofertas de vendedores para una carta: quién la vende, en qué condición
// e idioma, cuánto stock tiene y a qué precio — todo sembrado con el id
// de la carta para que sea distinto (pero estable) por carta, y así los
// filtros de condición/idioma/verificados diferencien resultados de verdad.
export function offersFor(card) {
  const market = marketPriceOf(card);
  const rand = mulberry32(seedFromId(card.id) ^ 0x9e3779b9);
  const conditionLabels = CONDITIONS.map((c) => c.label);

  let offers = SELLER_TEMPLATE.filter(() => rand() > 0.12).map(({ priceFactor, ...s }) => {
    const jitter = 0.94 + rand() * 0.12;
    return {
      ...s,
      cond: weightedPick(rand, conditionLabels, CONDITION_WEIGHTS),
      lang: weightedPick(rand, LANGS, LANG_WEIGHTS),
      qty: 1 + Math.floor(rand() * 4),
      price: Math.max(2, Math.round(market * priceFactor * jitter)),
      hasPhotos: rand() < 0.55,
      notes: weightedPick(rand, SELLER_NOTES, SELLER_NOTES.map(() => 1)),
    };
  });

  // que nunca queden menos de 3 vendedores (la ficha de carta no debe verse vacía)
  if (offers.length < 3) {
    offers = SELLER_TEMPLATE.map(({ priceFactor, ...s }) => ({
      ...s,
      cond: weightedPick(rand, conditionLabels, CONDITION_WEIGHTS),
      lang: weightedPick(rand, LANGS, LANG_WEIGHTS),
      qty: 1 + Math.floor(rand() * 4),
      price: Math.max(2, Math.round(market * priceFactor)),
      hasPhotos: rand() < 0.55,
      notes: weightedPick(rand, SELLER_NOTES, SELLER_NOTES.map(() => 1)),
    }));
  }
  return offers;
}

export const AUCTIONS = [
  {
    id: "a1", cardId: "4", seller: "DracoLima", verified: false,
    cond: "Near Mint", lang: "Inglés", start: 80, current: 132, bids: 14,
    minInc: 5, buyNow: 165, endsInMin: 47,
    lastBids: [
      { who: "Poke***rés", amt: 132, ago: "hace 2 min" },
      { who: "Kens***CG", amt: 127, ago: "hace 5 min" },
      { who: "Mari***a.Q", amt: 120, ago: "hace 11 min" },
    ],
  },
  { id: "a2", cardId: "p42", seller: "KensoTCG", verified: true, cond: "Near Mint", lang: "Inglés", start: 60, current: 88, bids: 9, minInc: 2, buyNow: null, endsInMin: 128, lastBids: [] },
  { id: "a3", cardId: "y43", seller: "CarpetaMiraflores", verified: true, cond: "Lightly Played", lang: "Español", start: 35, current: 51, bids: 6, minInc: 2, buyNow: 70, endsInMin: 320, lastBids: [] },
];

export const SELLERS = {
  KensoTCG: {
    name: "KensoTCG", rep: 4.9, sales: 212, since: "2024", zone: "Lince · Lima", verified: true,
    binders: [
      { tcg: "Pokémon", count: 84 },
      { tcg: "Magic", count: 37 },
      { tcg: "Yu-Gi-Oh", count: 52 },
    ],
    reviews: [
      { who: "Mariana Q.", stars: 5, txt: "Carta tal cual las fotos, sellada en Tienda Vortex. Todo rápido." },
      { who: "Diego A.", stars: 5, txt: "Buen trato, coordinar en Real Plaza fue fácil. Recomendado." },
      { who: "Luis P.", stars: 4, txt: "Todo bien, solo demoró un día más en dejar en tienda." },
    ],
  },
};

export const CHATS = [
  {
    id: "c1", with: "KensoTCG", verified: true, about: "Charizard ex · S/ 92",
    cardImg: "🔥", unread: 2, lastAt: "10:42",
    messages: [
      { from: "them", txt: "Hola! Sí, la carta sigue disponible 👍", at: "10:35" },
      { from: "me", txt: "Genial. ¿La condición es Near Mint seguro? ¿Tienes fotos con luz natural?", at: "10:37" },
      { from: "them", txt: "Sí, NM. Te paso fotos ahora mismo", at: "10:40" },
      { from: "them", txt: "¿Prefieres entrega en tienda o coordinamos? Yo paro por Lince", at: "10:42" },
    ],
  },
  {
    id: "c2", with: "DracoLima", verified: false, about: "Subasta: Ragavan · puja S/ 132",
    cardImg: "🐒", unread: 0, lastAt: "ayer",
    messages: [
      { from: "me", txt: "Si gano la subasta, ¿puedes dejar en tienda certificada?", at: "18:02" },
      { from: "them", txt: "Claro, dejo en Vortex de Miraflores sin problema", at: "18:15" },
    ],
  },
  {
    id: "c3", with: "PokeAndrés", verified: true, about: "Pikachu VMAX · S/ 68",
    cardImg: "⚡", unread: 0, lastAt: "lun",
    messages: [
      { from: "them", txt: "Gracias por la compra! Ya confirmé la entrega en tienda 🙌", at: "12:20" },
      { from: "me", txt: "Recibido, todo perfecto. Te dejé 5 estrellas ⭐", at: "14:05" },
    ],
  },
];

export const soles = (usd) => `S/ ${Math.max(2, Math.round(usd * 3.75))}`;
export const fmtMin = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`);

// Guía de condiciones — usada en /condiciones y en el chip de condición
// de cada oferta. level: 0 (mejor) a 4 (peor), para la ilustración CSS.
export const CONDITIONS = [
  {
    id: "near-mint",
    code: "NM",
    label: "Near Mint",
    level: 0,
    chipClass: "border-teal/40 bg-teal/10 text-teal",
    resumen: "Como recién salida del sobre. Es la condición que se paga más cara.",
    esquinas: "Perfectamente afiladas, sin desgaste visible.",
    bordes: "Lisos, sin whitening (blanqueado) ni melladuras.",
    superficie: "Brillo uniforme, sin rayones ni marcas de uso.",
    rayones: "Ninguno visible a simple vista.",
  },
  {
    id: "lightly-played",
    code: "LP",
    label: "Lightly Played",
    level: 1,
    chipClass: "border-vio/40 bg-vio/10 text-vio",
    resumen: "Desgaste mínimo, casi imperceptible salvo mirando de cerca.",
    esquinas: "Desgaste mínimo, apenas perceptible al tacto.",
    bordes: "Leve whitening en uno o dos puntos.",
    superficie: "Brillo casi intacto, sin rayones profundos.",
    rayones: "Micro-rayones que solo se ven con luz directa.",
  },
  {
    id: "moderately-played",
    code: "MP",
    label: "Moderately Played",
    level: 2,
    chipClass: "border-amber/40 bg-amber/10 text-amber",
    resumen: "Se nota que circuló, pero sigue siendo perfectamente jugable.",
    esquinas: "Redondeadas, desgaste visible al tacto.",
    bordes: "Whitening notorio en varios bordes.",
    superficie: "Pérdida de brillo, rayones leves visibles.",
    rayones: "Rayones superficiales, sin afectar la imagen.",
  },
  {
    id: "heavily-played",
    code: "HP",
    label: "Heavily Played",
    level: 3,
    chipClass: "border-orange-400/50 bg-orange-100 text-orange-600",
    resumen: "Desgaste evidente por uso frecuente en mazo. Ideal para jugar, no para coleccionar.",
    esquinas: "Desgastadas, posibles melladuras pequeñas.",
    bordes: "Whitening fuerte y consistente en todo el borde.",
    superficie: "Rayones visibles, posible pérdida de color en zonas.",
    rayones: "Rayones profundos y/o pequeñas marcas de doblez.",
  },
  {
    id: "danada",
    code: "DMG",
    label: "Dañada",
    level: 4,
    chipClass: "border-red-400/50 bg-red-100 text-red-600",
    resumen: "Daño estructural visible. Se vende como pieza de colección o repuesto, no para torneo.",
    esquinas: "Dobladas, rotas o con pliegues visibles.",
    bordes: "Rasgados, doblados o con daño estructural.",
    superficie: "Manchas, agua, tinta o rasgaduras.",
    rayones: "Daño que afecta la legibilidad o integridad de la carta.",
  },
];

export const conditionInfo = (label) =>
  CONDITIONS.find((c) => c.label === label) ?? CONDITIONS[2];
