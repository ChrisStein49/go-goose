import type { Language } from "./translations";

/**
 * German world names, keyed by world id. English has no lookup here — it's
 * just `world.name` from levels.ts, the canonical/original name. Falls back
 * to the English name if a world id is ever missing from this table.
 */
const worldNamesDe: Record<string, string> = {
  "world-001": "Start",
  "world-002": "Rasen",
  "world-003": "Hindernisse",
  "world-004": "Wiese",
  "world-005": "Nebel",
  "world-006": "Dickicht",
  "world-007": "Wald",
  "world-008": "Berg",
  "world-009": "Tal",
  "world-010": "Chaos",
  "world-011": "Weltraum",
  "world-012": "Vulkan",
  "world-013": "Sand",
  "world-014": "Düne",
  "world-015": "Mars",
  "world-016": "Nordpol",
  "world-017": "Schlucht",
  "world-021.1": "Labyrinth",
  "world-018": "Brunnen",
  "world-019": "Ozean",
  "world-020": "Lava",
  "world-021": "Dünnes Eis",
  "world-022": "Teppich",
  "world-023": "Garten",
  "world-024": "Hinterhof",
  "world-025": "Sumpf",
  "world-026": "Moor",
  "world-027": "Terrasse",
};

export function localizedWorldName(worldId: string, englishName: string, language: Language): string {
  if (language === "en") return englishName;
  return worldNamesDe[worldId] ?? englishName;
}
