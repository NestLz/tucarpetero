// ─── Datos de ejemplo del MVP ────────────────────────────────
// Reemplazar por base de datos real (Postgres/Supabase) en fase 2.

export const TCG_COLORS = {
  "Pokémon": "#F4B63F",
  "Yu-Gi-Oh": "#B85CDB",
  "Magic": "#E2703A",
};

export const CARDS = [
  { id: "1", tcg: "Pokémon", name: "Charizard ex", set: "Obsidian Flames", num: "125/197", rarity: "Double Rare", refUsd: 24.5, img: "🔥" },
  { id: "2", tcg: "Pokémon", name: "Pikachu VMAX", set: "Vivid Voltage", num: "044/185", rarity: "VMAX", refUsd: 18.0, img: "⚡" },
  { id: "3", tcg: "Magic", name: "Sol Ring", set: "Commander Masters", num: "464", rarity: "Uncommon", refUsd: 2.8, img: "💍" },
  { id: "4", tcg: "Magic", name: "Ragavan, Nimble Pilferer", set: "Modern Horizons 2", num: "138", rarity: "Mythic", refUsd: 38.0, img: "🐒" },
  { id: "5", tcg: "Yu-Gi-Oh", name: "Blue-Eyes White Dragon", set: "LOB (25th)", num: "LOB-001", rarity: "Ultra Rare", refUsd: 15.5, img: "🐉" },
  { id: "6", tcg: "Yu-Gi-Oh", name: "Ash Blossom & Joyous Spring", set: "MACR", num: "MACR-EN036", rarity: "Secret Rare", refUsd: 9.2, img: "🌸" },
];

export const OFFERS = {
  "1": [
    { seller: "KensoTCG", rep: 4.9, sales: 212, cond: "Near Mint", lang: "Inglés", price: 92, verified: true, delivery: ["tienda", "coordinar"] },
    { seller: "CarpetaMiraflores", rep: 4.8, sales: 147, cond: "Near Mint", lang: "Inglés", price: 95, verified: true, delivery: ["tienda"] },
    { seller: "DracoLima", rep: 4.6, sales: 64, cond: "Lightly Played", lang: "Inglés", price: 84, verified: false, delivery: ["coordinar"] },
    { seller: "PokeAndrés", rep: 4.9, sales: 301, cond: "Near Mint", lang: "Español", price: 99, verified: true, delivery: ["tienda", "coordinar"] },
    { seller: "BinderSJM", rep: 4.2, sales: 23, cond: "Moderately Played", lang: "Inglés", price: 75, verified: false, delivery: ["coordinar"] },
  ],
};

// Ofertas genéricas para cartas sin listado propio
export const DEFAULT_OFFERS = OFFERS["1"];

export const PRICE_HISTORY = [88, 91, 86, 90, 94, 92, 89, 93, 96, 92, 90, 92];

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
  { id: "a2", cardId: "1", seller: "KensoTCG", verified: true, cond: "Near Mint", lang: "Inglés", start: 60, current: 88, bids: 9, minInc: 2, buyNow: null, endsInMin: 128, lastBids: [] },
  { id: "a3", cardId: "5", seller: "CarpetaMiraflores", verified: true, cond: "Lightly Played", lang: "Español", start: 35, current: 51, bids: 6, minInc: 2, buyNow: 70, endsInMin: 320, lastBids: [] },
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

export const soles = (usd) => `S/ ${(usd * 3.75).toFixed(0)}`;
export const fmtMin = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`);
