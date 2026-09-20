export interface CourseSectionItem {
  id: string;
  title: string;
  type: "video" | "problem" | "article";
  asset_id: string;
  slug?: string;
  is_free: boolean;
  duration_label?: string;
  solution_url?: string;
  problem_url?: string;
  video_url?: string;
  difficulty?: string;
  description?: string;
}

export interface CourseSubsection {
  id: string;
  title: string;
  description?: string;
  items: CourseSectionItem[];
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  items?: CourseSectionItem[];
  subsections?: CourseSubsection[];
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  company: string;
  color?: string;
  profile_image_url?: string;
  bio?: string;
}

export interface CourseMetadata {
  difficulty?: string;
  duration_weeks?: number;
  duration_hours?: number;
  total_projects?: number;
  marketing_syllabus?: string[];
  thumbnail_url?: string;
  prerequisites?: string[];
  learning_outcomes?: string[];
  rating?: number;
  reviews?: number;
  number_of_students?: number;
  [key: string]: any;
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  instructor_ids?: string[];
  instructors?: Instructor[];
  tags: string[];
  is_pro: boolean;
  is_popular?: boolean;
  status: "active" | "upcoming" | "draft";
  price: number;
  original_price: number;
  total_problems: number;
  total_articles: number;
  total_videos: number;
  sections?: CourseSection[];
  curriculum?: CourseSection[];
  metadata?: CourseMetadata;
  created_at?: string;
  updated_at?: string;
}

export interface VideoLecture {
  id: string;
  title: string;
  description?: string;
  video_url?: string;
  embed_url?: string;
  is_free?: boolean;
  is_locked?: boolean;
  require_pro?: boolean;
  is_protected?: boolean;
  duration_seconds?: number;
  thumbnail_url?: string;
  resources?: {
    blogs?: string[];
    problems?: string[];
    assignments?: string[];
    [key: string]: any;
  };
  attributes?: {
    tags?: string[];
    topics?: string[];
    difficulty?: string;
    learning_outcomes?: string[];
    [key: string]: any;
  };
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProblemSolution {
  code?: string;
  explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
}

export interface PracticeProblem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  difficulty?: string;
  platform?: string;
  problem_url?: string;
  solutions?: Record<string, ProblemSolution>;
  attributes?: {
    tags?: string[];
    hints?: string[];
    company_tags?: string[];
    [key: string]: any;
  };
  resources?: {
    video_lectures?: string[];
    related_articles?: string[];
    [key: string]: any;
  };
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
