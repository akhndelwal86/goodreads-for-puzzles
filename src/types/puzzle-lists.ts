// Canonical puzzle list types for consistent use across frontend and backend

export const PUZZLE_LISTS = [
  { slug: 'want_to_buy', name: 'Want to Buy' },
  { slug: 'backlog', name: 'Backlog' },
  { slug: 'in_progress', name: 'Work in Progress' },
  { slug: 'completed', name: 'Completed' },
] as const;

export type PuzzleListSlug = typeof PUZZLE_LISTS[number]['slug'];

export function getPuzzleListName(slug: PuzzleListSlug): string {
  const found = PUZZLE_LISTS.find(l => l.slug === slug);
  return found ? found.name : slug;
} 