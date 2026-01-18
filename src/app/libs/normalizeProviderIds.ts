export default function normalizeProviderIds(raw: string): string[]| string {
  if (!raw) return [];

  // 1) Try to JSON.parse (works for JSON array and JSON string)
  try {
    const parsed = JSON.parse(raw);

    // JSON array → return as is
    if (Array.isArray(parsed)) return parsed;

    // JSON string → wrap it
    if (typeof parsed === "string") return [parsed];
  } catch {
    // If JSON.parse fails, try comma separated
  }

  // 2) Try comma-separated: "a,b,c"
  if (raw.includes(",")) {
    return raw.split(",").map(s => s.trim()).filter(Boolean);
  }

  // 3) Single ID string
  return [raw.trim()];
}
