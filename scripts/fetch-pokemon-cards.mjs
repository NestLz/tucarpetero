// Trae un pool amplio de cartas Pokémon REALES y actualmente jugables
// (formato Standard vigente) desde pokemontcg.io, y lo guarda en
// lib/pokemon-cards.json. Correr manualmente:
//   node scripts/fetch-pokemon-cards.mjs
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.join(__dirname, "..", "lib", "pokemon-cards.json");

// Sets que conforman (aprox.) la rotación Standard vigente — actualizar
// esta lista cuando el formato rote. Se puede consultar la rotación real
// en GET https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate
const CURRENT_SETS = [
  "sv6pt5", // Shrouded Fable
  "sv7", // Stellar Crown
  "sv8", // Surging Sparks
  "sv8pt5", // Prismatic Evolutions
  "sv9", // Journey Together
  "sv10", // Destined Rivals
  "zsv10pt5", // Black Bolt
  "rsv10pt5", // White Flare
  "me1", // Mega Evolution
  "me2", // Phantasmal Flames
  "me2pt5", // Ascended Heroes
  "me3", // Perfect Order
  "me4", // Chaos Rising
  "me5", // Pitch Black
];

const RARITY_WEIGHT = {
  "Special Illustration Rare": 100,
  "Hyper Rare": 95,
  "Illustration Rare": 85,
  "Ultra Rare": 75,
  "Double Rare": 65,
  "Rare Holo ex": 60,
  "Rare Holo": 40,
  Rare: 30,
  Uncommon: 15,
  Common: 5,
};

function rarityScore(card) {
  return RARITY_WEIGHT[card.rarity] ?? 20;
}

function priceOf(card) {
  const tp = card.tcgplayer?.prices;
  if (tp) {
    const variant =
      tp.holofoil ||
      tp.reverseHolofoil ||
      tp.normal ||
      tp["1stEditionHolofoil"] ||
      tp.unlimitedHolofoil ||
      Object.values(tp)[0];
    if (variant?.market) return Math.round(variant.market * 100) / 100;
  }
  const cm = card.cardmarket?.prices?.averageSellPrice;
  if (cm) return Math.round(cm * 100) / 100;
  return 3;
}

// Especie base del nombre, ignorando prefijos de forma (Mega, Alolan, etc.)
function speciesOf(name) {
  return name
    .replace(/^(Mega |Dark |Shining |Radiant |Galarian |Alolan |Hisuian |Paldean )/, "")
    .split(" ")[0];
}

async function fetchAllCurrentPokemon() {
  const setQuery = CURRENT_SETS.map((s) => `set.id:${s}`).join(" OR ");
  const q = `supertype:Pokémon (${setQuery})`;
  const pageSize = 250;
  let page = 1;
  let all = [];
  while (true) {
    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(
      q
    )}&pageSize=${pageSize}&page=${page}&orderBy=-set.releaseDate`;
    console.log(`Consultando página ${page}…`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API respondió ${res.status}`);
    const { data, totalCount } = await res.json();
    all = all.concat(data);
    if (data.length === 0 || all.length >= totalCount) break;
    page++;
  }
  return all;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  const all = await fetchAllCurrentPokemon();
  const withImages = all.filter((c) => c.images?.large);
  console.log(`${withImages.length} cartas jugables con imagen disponible.`);

  // Agrupar por especie, mejor rareza primero
  const bySpecies = new Map();
  for (const c of withImages) {
    const key = speciesOf(c.name);
    if (!bySpecies.has(key)) bySpecies.set(key, []);
    bySpecies.get(key).push(c);
  }
  for (const list of bySpecies.values()) {
    list.sort((a, b) => rarityScore(b) - rarityScore(a));
  }

  // 1) una carta "estrella" (mayor rareza) por especie, para variedad
  const speciesEntries = [...bySpecies.entries()].sort(
    (a, b) => rarityScore(b[1][0]) - rarityScore(a[1][0])
  );

  const picked = [];
  const usedIds = new Set();
  const MAX_STARS = 55;
  for (const [, list] of speciesEntries) {
    if (picked.length >= MAX_STARS) break;
    const best = list[0];
    picked.push(best);
    usedIds.add(best.id);
  }

  // 2) sumar comunes/poco comunes de especies distintas, para variedad de precio
  const seenSpecies = new Set(picked.map((c) => speciesOf(c.name)));
  const cheapCandidates = shuffle(
    withImages.filter(
      (c) => !usedIds.has(c.id) && ["Common", "Uncommon"].includes(c.rarity)
    )
  );
  const CHEAP_TARGET = 20;
  for (const c of cheapCandidates) {
    if (picked.length >= MAX_STARS + CHEAP_TARGET) break;
    const sp = speciesOf(c.name);
    if (seenSpecies.has(sp)) continue;
    picked.push(c);
    seenSpecies.add(sp);
    usedIds.add(c.id);
  }

  const final = shuffle(picked);

  const cards = final.map((c, i) => ({
    id: `p${i + 1}`,
    tcg: "Pokémon",
    name: c.name,
    set: c.set.name,
    num: c.set.printedTotal ? `${c.number}/${c.set.printedTotal}` : c.number,
    rarity: c.rarity || "—",
    refUsd: priceOf(c),
    img: c.images.large,
    setId: c.set.id,
    setReleaseDate: c.set.releaseDate,
  }));

  await writeFile(OUT_FILE, JSON.stringify(cards, null, 2) + "\n", "utf-8");
  console.log(`✓ Guardadas ${cards.length} cartas en ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
