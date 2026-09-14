import { ContestPlatform, PlatformConfig, ContestTagsJson } from '@/types/contest';

export const PLATFORMS: Record<ContestPlatform, PlatformConfig> = {
  leetcode: {
    id: 'leetcode',
    name: 'LeetCode',
    description: 'Weekly & Biweekly contest video editorials, code solutions, and intuitions.',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    accentBg: 'from-amber-500/10 via-amber-500/5 to-transparent',
    accentBorder: 'hover:border-amber-500/50',
    accentText: 'text-amber-500',
    iconName: 'Code2',
  },
  codeforces: {
    id: 'codeforces',
    name: 'Codeforces',
    description: 'Div. 2, Div. 3, Div. 4 & Educational Round walkthroughs, editorial analysis, and clean AC code.',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    accentBg: 'from-blue-500/10 via-blue-500/5 to-transparent',
    accentBorder: 'hover:border-blue-500/50',
    accentText: 'text-blue-500',
    iconName: 'Terminal',
  },
  codechef: {
    id: 'codechef',
    name: 'CodeChef',
    description: 'Starters & Cook-Off editorials, problem breakdown videos, and test-case discussions.',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    accentBg: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    accentBorder: 'hover:border-emerald-500/50',
    accentText: 'text-emerald-500',
    iconName: 'Flame',
  },
};

export function slugifyContest(contestName: string): string {
  if (!contestName) return '';
  return contestName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-')     // replace spaces with hyphens
    .replace(/-+/g, '-');     // collapse multiple hyphens
}

export function parseTags(tagsField: any): string[] {
  if (!tagsField) return [];
  let rawList: any[] = [];
  if (Array.isArray(tagsField)) {
    rawList = tagsField;
  } else if (typeof tagsField === 'object' && Array.isArray(tagsField.tags)) {
    rawList = tagsField.tags;
  }

  return rawList
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        return item.label || item.value || item.name || '';
      }
      return '';
    })
    .filter(Boolean);
}

export function getDifficultyBadge(difficulty: number, platform: ContestPlatform): {
  label: string;
  colorClass: string;
} {
  const d = Number(difficulty);

  if (platform === 'leetcode') {
    if (d === 0) return { label: 'Easy', colorClass: 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20' };
    if (d === 1) return { label: 'Medium', colorClass: 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/20' };
    if (d === 2) return { label: 'Hard', colorClass: 'text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/20' };
    if (d >= 3) return { label: 'Advanced', colorClass: 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/20' };
    return { label: `Diff ${d}`, colorClass: 'text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-500/10 border-zinc-300 dark:border-zinc-500/20' };
  }

  if (platform === 'codeforces') {
    switch (d) {
      case 0:
        return { label: 'Newbie', colorClass: 'text-zinc-700 bg-zinc-100 dark:text-zinc-300 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700' };
      case 1:
        return { label: 'Pupil', colorClass: 'text-green-700 bg-green-100 dark:text-emerald-400 dark:bg-emerald-500/10 border-green-300 dark:border-emerald-500/20' };
      case 2:
        return { label: 'Specialist', colorClass: 'text-cyan-700 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-500/10 border-cyan-300 dark:border-cyan-500/20' };
      case 3:
        return { label: 'Expert', colorClass: 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/20' };
      case 4:
        return { label: 'Candidate Master', colorClass: 'text-violet-700 bg-violet-100 dark:text-violet-400 dark:bg-violet-500/10 border-violet-300 dark:border-violet-500/20' };
      case 5:
        return { label: 'Master', colorClass: 'text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/20' };
      case 6:
        return { label: 'Grandmaster', colorClass: 'text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/20' };
      default:
        return { label: `Div ${d}`, colorClass: 'text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-500/10 border-zinc-300 dark:border-zinc-500/20' };
    }
  }

  // CodeChef
  if (platform === 'codechef') {
    switch (d) {
      case 0:
        return { label: '1 Star', colorClass: 'text-zinc-700 bg-zinc-100 dark:text-zinc-300 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700' };
      case 1:
        return { label: '2 Star', colorClass: 'text-green-700 bg-green-100 dark:text-emerald-400 dark:bg-emerald-500/10 border-green-300 dark:border-emerald-500/20' };
      case 2:
        return { label: '3 Star', colorClass: 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/20' };
      case 3:
        return { label: '4 Star', colorClass: 'text-purple-700 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/20' };
      case 4:
        return { label: '5 Star', colorClass: 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/20' };
      case 5:
        return { label: '6 Star', colorClass: 'text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/20' };
      case 6:
        return { label: '7 Star', colorClass: 'text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/20' };
      default:
        return { label: `${d} Star`, colorClass: 'text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-500/10 border-zinc-300 dark:border-zinc-500/20' };
    }
  }

  return { label: 'Unrated', colorClass: 'text-zinc-500 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-500/10 border-zinc-300 dark:border-zinc-500/20' };
}
