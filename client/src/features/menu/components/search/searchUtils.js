export const escapeHtml = (unsafe) =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const highlight = (text = "", query = "") => {
  if (!query) return escapeHtml(text);
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"));

  if (tokens.length === 0) return escapeHtml(text);
  const regex = new RegExp(`(${tokens.join("|")})`, "gi");
  return escapeHtml(text).replace(
    regex,
    '<mark class="bg-yellow-300 rounded">$1</mark>'
  );
};
