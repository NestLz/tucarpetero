// Trae un pool de cartas Yu-Gi-Oh REALES de las últimas 10 expansiones
// (Booster Packs / sets de rareza reales, no structure decks ni promos
// de torneo) desde YGOPRODeck, y lo guarda en lib/yugioh-cards.json.
// Correr manualmente:
//   node scripts/fetch-yugioh-cards.mjs
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.join(__dirname, "..", "lib", "yugioh-cards.json");

const N_SETS = 10;
const STARS_PER_SET = 4; // cartas de mayor rareza por set
const CHEAP_PER_SET = 2; // comunes/raras por set, para variedad de precio

// Nombres de "producto" que no son expansiones reales (structure decks,
// packs de torneo, promos de un solo card, etc.)
const EXCLUDE_PATTERN =
  /Structure Deck|Starter Deck|OTS Tournament Pack|The Lost Art Promotion|Limited Pack|prize cards|Championship Series|\bWCS\b|Mega-Pack Tin|Legendary .*Decks?|CHRONICLES DECK|Ultimate Tournament Pack/i;

const RARITY_WEIGHT = {
  "Quarter Century Secret Rare": 100,
  "Starlight Rare": 95,
  "Collector's Rare": 92,
  "Ghost Rare": 90,
  "Prismatic Secret Rare": 85,
  "Platinum Secret Rare": 82,
  "Ultimate Rare": 70,
  "Secret Rare": 65,
  "Ultra Rare": 55,
  "Super Rare": 35,
  Rare: 20,
  Common: 5,
};

function rarityScore(setEntry) {
  return RARITY_WEIGHT[setEntry?.set_rarity] ?? 15;
}

function priceOf(card) {
  const p = card.card_prices?.[0];
  if (!p) return 2;
  const val = Number(p.tcgplayer_price) || Number(p.cardmarket_price) || Number(p.ebay_price) || 0;
  return val > 0 ? Math.round(val * 100) / 100 : 2;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API respondió ${res.status} para ${url}`);
  return res.json();
}

async function main() {
  console.log("Consultando lista de expansiones…");
  const allSets = await fetchJson("https://db.ygoprodeck.com/api/v7/cardsets.php");
  const today = new Date().toISOString().slice(0, 10);

  const expansions = allSets
    .filter(
      (s) =>
        s.tcg_date &&
        s.tcg_date <= today &&
        s.num_of_cards >= 40 &&
        !EXCLUDE_PATTERN.test(s.set_name)
    )
    .sort((a, b) => (a.tcg_date < b.tcg_date ? 1 : -1))
    .slice(0, N_SETS);

  console.log(
    `Últimas ${expansions.length} expansiones:`,
    expansions.map((s) => `${s.set_name} (${s.tcg_date})`)
  );

  const allCards = [];
  for (const set of expansions) {
    console.log(`Consultando cartas de "${set.set_name}"…`);
    let cards;
    try {
      const data = await fetchJson(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${encodeURIComponent(set.set_name)}`
      );
      cards = data.data;
    } catch (err) {
      console.warn(`⚠️  No se pudo traer "${set.set_name}": ${err.message}`);
      continue;
    }

    const withMeta = cards
      .filter((c) => c.card_images?.[0]?.image_url)
      .map((c) => {
        const setEntry =
          c.card_sets?.find((cs) => cs.set_name === set.set_name) ?? c.card_sets?.[0];
        return { card: c, setEntry, set };
      })
      .filter((x) => x.setEntry);

    withMeta.sort((a, b) => rarityScore(b.setEntry) - rarityScore(a.setEntry));
    const stars = withMeta.slice(0, STARS_PER_SET);

    const usedIds = new Set(stars.map((x) => x.card.id));
    const cheapPool = shuffle(
      withMeta.filter(
        (x) =>
          !usedIds.has(x.card.id) &&
          ["Common", "Rare"].includes(x.setEntry.set_rarity)
      )
    ).slice(0, CHEAP_PER_SET);

    allCards.push(...stars, ...cheapPool);
  }

  const final = shuffle(allCards);
  const yugiohCards = final.map((x, i) => ({
    id: `y${i + 1}`,
    tcg: "Yu-Gi-Oh",
    name: x.card.name,
    set: x.set.set_name,
    num: x.setEntry.set_code,
    rarity: x.setEntry.set_rarity,
    refUsd: priceOf(x.card),
    img: x.card.card_images[0].image_url,
    setId: x.set.set_code,
    setReleaseDate: x.set.tcg_date.replace(/-/g, "/"),
  }));

  await writeFile(OUT_FILE, JSON.stringify(yugiohCards, null, 2) + "\n", "utf-8");
  console.log(`✓ Guardadas ${yugiohCards.length} cartas en ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
