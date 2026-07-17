// Añade setId + setReleaseDate a las cartas ya guardadas en
// lib/pokemon-cards.json, sin volver a consultar la API ni reordenar
// (así no rompe las referencias cruzadas en lib/data.js). Correr una
// sola vez tras haber traído el pool con fetch-pokemon-cards.mjs.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "..", "lib", "pokemon-cards.json");

// Mismos sets que CURRENT_SETS en fetch-pokemon-cards.mjs, con su fecha real.
const SET_INFO = {
  "Shrouded Fable": { id: "sv6pt5", releaseDate: "2024/08/02" },
  "Stellar Crown": { id: "sv7", releaseDate: "2024/09/13" },
  "Surging Sparks": { id: "sv8", releaseDate: "2024/11/08" },
  "Prismatic Evolutions": { id: "sv8pt5", releaseDate: "2025/01/17" },
  "Journey Together": { id: "sv9", releaseDate: "2025/03/28" },
  "Destined Rivals": { id: "sv10", releaseDate: "2025/05/30" },
  "Black Bolt": { id: "zsv10pt5", releaseDate: "2025/07/18" },
  "White Flare": { id: "rsv10pt5", releaseDate: "2025/07/18" },
  "Mega Evolution": { id: "me1", releaseDate: "2025/09/26" },
  "Phantasmal Flames": { id: "me2", releaseDate: "2025/11/14" },
  "Ascended Heroes": { id: "me2pt5", releaseDate: "2026/01/30" },
  "Perfect Order": { id: "me3", releaseDate: "2026/03/27" },
  "Chaos Rising": { id: "me4", releaseDate: "2026/05/22" },
  "Pitch Black": { id: "me5", releaseDate: "2026/07/17" },
};

const cards = JSON.parse(await readFile(FILE, "utf-8"));

let missing = 0;
const enriched = cards.map((c) => {
  const info = SET_INFO[c.set];
  if (!info) {
    missing++;
    console.warn(`⚠️  Sin info de fecha para el set "${c.set}" (carta ${c.id})`);
    return c;
  }
  return { ...c, setId: info.id, setReleaseDate: info.releaseDate };
});

await writeFile(FILE, JSON.stringify(enriched, null, 2) + "\n", "utf-8");
console.log(`✓ Enriquecidas ${enriched.length - missing}/${enriched.length} cartas con setId + setReleaseDate.`);
