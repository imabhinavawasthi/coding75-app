import { CourseSummary, CourseSection, VideoLecture, PracticeProblem } from "@/types/course";
import { BatchTopicResponse } from "./courseCatalogSync";
import supabase from "@/supabase";

/**
 * Target course ID for the production DSA portal.
 */
export const TARGET_DSA_COURSE_ID = "54b8ebac-66f4-498a-9b94-66a149866d3e";

/**
 * Shared helper — builds auth headers if a token exists.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
    } catch {}
  }
  return headers;
}

/**
 * Fetch course details from the Next.js API route.
 * Sends the user's Supabase session token if logged in.
 */
export async function fetchCourseDetail(courseIdOrSlug: string = TARGET_DSA_COURSE_ID): Promise<{ course: CourseSummary | null; error: string | null }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/courses/${encodeURIComponent(courseIdOrSlug)}`, {
      cache: "no-store",
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      return { course: null, error: data.error || `Course '${courseIdOrSlug}' could not be loaded.` };
    }
    return { course: data.course || null, error: null };
  } catch (error: any) {
    console.error("Error fetching course detail:", error);
    return { course: null, error: error.message || "Failed to fetch course from server" };
  }
}

/**
 * Fetch course curriculum section tree by course ID or slug from the database.
 */
export async function fetchCourseCurriculum(courseIdOrSlug: string = TARGET_DSA_COURSE_ID): Promise<CourseSection[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/courses/${encodeURIComponent(courseIdOrSlug)}/curriculum`, {
      cache: "no-store",
      headers,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.curriculum || [];
  } catch (err) {
    console.error("Error fetching course curriculum:", err);
    return [];
  }
}

/**
 * Fetch batch topic details for multiple topics in a single call.
 */
export async function fetchBatchTopicDetails(
  courseIdOrSlug: string = TARGET_DSA_COURSE_ID,
  topics: string[]
): Promise<BatchTopicResponse | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/courses/${encodeURIComponent(courseIdOrSlug)}/batch-topic-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ topics }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching batch topic details:", error);
    return null;
  }
}

/**
 * Fetch video lecture details from the database.
 */
export async function fetchVideoDetail(videoId: string): Promise<{ video: VideoLecture | null; error: string | null }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/videos/${encodeURIComponent(videoId)}`, {
      cache: "no-store",
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      return { video: null, error: data.error || `Video lecture '${videoId}' not found.` };
    }
    return { video: data.video || null, error: null };
  } catch (error: any) {
    console.error("Error fetching video detail:", error);
    return { video: null, error: error.message || "Failed to load video lecture" };
  }
}

/**
 * Fetch practice problem details from the database.
 */
export async function fetchProblemDetail(problemId: string): Promise<{ problem: PracticeProblem | null; error: string | null }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/problems/${encodeURIComponent(problemId)}`, {
      cache: "no-store",
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      return { problem: null, error: data.error || `Practice problem '${problemId}' not found.` };
    }
    return { problem: data.problem || null, error: null };
  } catch (error: any) {
    console.error("Error fetching problem detail:", error);
    return { problem: null, error: error.message || "Failed to load practice problem" };
  }
}

/**
 * Fetch all available courses from the database.
 */
export async function fetchCourses(): Promise<CourseSummary[]> {
  try {
    const res = await fetch(`/api/courses`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.courses || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
