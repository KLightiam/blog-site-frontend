const WORDS_PER_MINUTE = 220;

const words = (text = '') => text.trim().split(/\s+/).filter(Boolean);

export function excerpt(content, length = 28) {
  const w = words(content);
  if (w.length <= length) return w.join(' ');
  return `${w.slice(0, length).join(' ').replace(/[,.;:!?]+$/, '')}…`;
}

export function readingTime(content) {
  return Math.max(1, Math.round(words(content).length / WORDS_PER_MINUTE));
}

export function formatDate(value, { short = false } = {}) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: short ? 'short' : 'long', year: 'numeric' });
}

export function coverOf(post) {
  return post?.files?.find((f) => f.url)?.url ?? null;
}

// Split the stored text into paragraphs on blank lines (or single newlines as a fallback).
export function paragraphs(content = '') {
  const blocks = content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (blocks.length > 1) return blocks;
  return content.split(/\n/).map((p) => p.trim()).filter(Boolean);
}
