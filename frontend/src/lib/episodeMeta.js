/**
 * Shared formatting for YouTube episode data, used by both the latest-episode
 * section on the home page and the episode archive.
 */

/** "PT1H24M16S" → 5056 seconds. Returns 0 when the duration is missing. */
export const durationSeconds = (iso) => {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!match) return 0;
  const [h, m, s] = [match[1] ?? 0, match[2] ?? 0, match[3] ?? 0].map(Number);
  return h * 3600 + m * 60 + s;
};

/** "PT1H24M16S" → "1:24:16" (or "24:16" when under an hour). */
export const formatDuration = (iso) => {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!match) return null;
  const [h, m, s] = [match[1] ?? 0, match[2] ?? 0, match[3] ?? 0].map(Number);
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

export const formatDate = (iso) => {
  const date = new Date(iso);
  return Number.isNaN(date.valueOf())
    ? null
    : new Intl.DateTimeFormat("sl-SI", { day: "numeric", month: "numeric", year: "numeric" }).format(date);
};

export const formatCount = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? new Intl.NumberFormat("sl-SI").format(n) : null;
};

/**
 * YouTube titles carry a "| Individuum Podcast #50" tail that is pure noise on
 * Individuum's own site — but the number in it is worth keeping, so it moves
 * into the metadata where the other record numbers live.
 */
const BRANDING_TAIL = /\s*[|–-]\s*individuum\s*podcast\s*(?:#\s*(\d+))?\s*$/i;

export const parseTitle = (raw) => {
  if (!raw) return { title: null, episode: null };
  const match = raw.match(BRANDING_TAIL);
  return {
    title: (match ? raw.replace(BRANDING_TAIL, "") : raw).trim(),
    episode: match?.[1] ?? null,
  };
};

/** YouTube gives several thumbnail sizes and not every video has every one. */
export const pickThumbnail = (thumbnails) =>
  thumbnails?.maxres?.url ??
  thumbnails?.high?.url ??
  thumbnails?.medium?.url ??
  thumbnails?.default?.url ??
  null;
