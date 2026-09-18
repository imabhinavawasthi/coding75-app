export interface DetailedProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  problem_url?: string;
}

export interface Problem {
  problem_id: string;
  title?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  problem_url?: string;
  platform?: string;
}

export interface Step {
  id: string;
  title: string;
  pattern_id: string;
  problems: Problem[];
}

export interface Topic {
  id: string;
  title: string;
  steps: Step[];
}

export interface SheetJSON {
  topics: Topic[];
}

export interface DSASheet {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  level?: string;
  estimated_hours?: number;
  is_public?: boolean;
  version?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  sheet_json?: SheetJSON;
  total_topics?: number;
  total_problems?: number;
}
