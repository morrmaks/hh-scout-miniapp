import he from 'he';

const RE_BR = /<br\s*\/?>/gi;
const RE_P_CLOSE = /<\/p>/gi;
const RE_LI_CLOSE = /<\/li>/gi;
const RE_LI_OPEN = /<li>/gi;
const RE_TAGS = /<[^>]+>/g;
const RE_NEWLINES = /\n{3,}/g;

export function formatDescription(html: string) {
  const decoded = he.decode(html);

  return decoded
    .replace(RE_BR, '\n')
    .replace(RE_P_CLOSE, '\n\n')
    .replace(RE_LI_CLOSE, '\n')
    .replace(RE_LI_OPEN, '— ')
    .replace(RE_TAGS, '')
    .replace(RE_NEWLINES, '\n\n')
    .trim();
}
