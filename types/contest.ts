export type ContestPlatform = 'leetcode' | 'codeforces' | 'codechef';

export interface ContestTagsJson {
  tags?: string[];
  [key: string]: any;
}

export interface UnifiedProblemRecord {
  id: string;
  platform: ContestPlatform;
  created_at: string;
  problem_name: string;
  problem_description: string | null;
  problem_link: string | null;
  video_editorial: string | null;
  editorial: string | null;
  difficulty: number;
  company_tags?: any;
  topic_tags?: any;
  slug_url: string;
  contest: string | null;
  solution_link: string | null;
}

export interface ContestEditorial {
  id: string;
  platform: ContestPlatform;
  created_at: string;
  problem_name: string;
  problem_description: string | null;
  problem_link: string | null;
  video_editorial: string | null;
  editorial: string | null;
  difficulty: number;
  company_tags?: ContestTagsJson | string[];
  topic_tags?: ContestTagsJson | string[];
  slug_url: string;
  contest: string | null;
  solution_link: string | null;
  // UI status tracking
  userStatus?: 'pending' | 'revise' | 'solved';
  isBookmarked?: boolean;
}

export interface ContestSummary {
  id: string;
  name: string;
  slug: string;
  platform: ContestPlatform;
  total_problems: number;
  created_at: string;
  difficulties?: number[];
}

export interface ContestDetail {
  name: string;
  slug: string;
  platform: ContestPlatform;
  created_at?: string;
  problems: ContestEditorial[];
}

export interface PlatformConfig {
  id: ContestPlatform;
  name: string;
  description: string;
  badgeColor: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  iconName: string;
}
