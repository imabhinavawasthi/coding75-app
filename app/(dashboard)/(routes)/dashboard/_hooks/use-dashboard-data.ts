"use client";

import { useEffect, useState, useMemo } from "react";
import { getValidUser } from "@/lib/auth-client";
import { fetchLeetcodePOTDProblems } from "@/app/(dashboard)/(routes)/dsa-cp/(api)/leetcode/fetchLeetcodePOTDProblems";
import { fetchCourseCurriculum, TARGET_DSA_COURSE_ID } from "@/lib/courses";
import { fetchUserAssetStates, UserAssetState } from "@/lib/user-states";
import { dsaModules, DSATopicModule, TOPIC_KEYWORDS } from "@/config/dsa-catalog";
import { CourseSection, CourseSectionItem } from "@/types/course";
import { POTDProblemItem } from "@/app/(dashboard)/(routes)/dsa-cp/_components/leetcode-potd-table";

export interface ActiveTopicProgress {
  module: DSATopicModule;
  section: CourseSection | null;
  totalItems: number;
  completedItems: number;
  progressPercent: number;
  nextItem: CourseSectionItem | null;
  isCompleted: boolean;
}

export function useDashboardData() {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [potd, setPotd] = useState<POTDProblemItem | null>(null);
  const [loadingPotd, setLoadingPotd] = useState(true);

  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [loadingLearning, setLoadingLearning] = useState(true);

  // 1. Fetch user on mount
  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      try {
        const validUser = await getValidUser();
        if (isMounted) {
          setUser(validUser);
        }
      } catch (err) {
        console.error("Dashboard user load error:", err);
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    }
    loadUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch today's LeetCode POTD
  useEffect(() => {
    let isMounted = true;
    async function loadPOTD() {
      try {
        const { dsaproblems } = await fetchLeetcodePOTDProblems();
        if (isMounted && dsaproblems && dsaproblems.length > 0) {
          setPotd(dsaproblems[0] as POTDProblemItem);
        }
      } catch (err) {
        console.error("Dashboard POTD load error:", err);
      } finally {
        if (isMounted) setLoadingPotd(false);
      }
    }
    loadPOTD();
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Fetch course curriculum & user asset completion states
  useEffect(() => {
    let isMounted = true;
    async function loadLearningState() {
      try {
        const [sections, states] = await Promise.all([
          fetchCourseCurriculum(TARGET_DSA_COURSE_ID),
          fetchUserAssetStates(),
        ]);
        if (isMounted) {
          setCurriculum(sections || []);
          setUserStates(states || {});
        }
      } catch (err) {
        console.error("Dashboard curriculum load error:", err);
      } finally {
        if (isMounted) setLoadingLearning(false);
      }
    }
    loadLearningState();
    return () => {
      isMounted = false;
    };
  }, []);

  // 4. Derive Active Topic in Progress & Next Recommended Item
  const activeTopicProgress = useMemo<ActiveTopicProgress>(() => {
    const defaultModule = dsaModules[0];
    if (!curriculum || curriculum.length === 0) {
      return {
        module: defaultModule,
        section: null,
        totalItems: 12,
        completedItems: 0,
        progressPercent: 0,
        nextItem: null,
        isCompleted: false,
      };
    }

    // Helper to find matching module for a curriculum section
    const matchModuleForSection = (section: CourseSection): DSATopicModule => {
      const titleLower = (section.title || "").toLowerCase();
      const direct = dsaModules.find(
        (m) =>
          titleLower.includes(m.id.toLowerCase()) ||
          (m.slug && titleLower.includes(m.slug.toLowerCase())) ||
          m.title.toLowerCase().includes(titleLower) ||
          titleLower.includes(m.title.toLowerCase())
      );
      if (direct) return direct;

      // Keyword match
      for (const mod of dsaModules) {
        const kws = TOPIC_KEYWORDS[mod.id] || [];
        if (kws.some((kw) => titleLower.includes(kw))) {
          return mod;
        }
      }
      return defaultModule;
    };

    // Evaluate all sections
    let firstInProgress: {
      section: CourseSection;
      module: DSATopicModule;
      total: number;
      completed: number;
      nextItem: CourseSectionItem | null;
    } | null = null;

    let firstUnstarted: {
      section: CourseSection;
      module: DSATopicModule;
      total: number;
      completed: number;
      nextItem: CourseSectionItem | null;
    } | null = null;

    for (const section of curriculum) {
      const items = Array.isArray(section.items) ? section.items : [];
      if (items.length === 0) continue;

      let completedCount = 0;
      let nextUnfinished: CourseSectionItem | null = null;

      for (const it of items) {
        const isDone = userStates[it.id]?.status === "done";
        if (isDone) {
          completedCount++;
        } else if (!nextUnfinished) {
          nextUnfinished = it;
        }
      }

      const mod = matchModuleForSection(section);

      // If partially completed, this is the prime active section!
      if (completedCount > 0 && completedCount < items.length) {
        firstInProgress = {
          section,
          module: mod,
          total: items.length,
          completed: completedCount,
          nextItem: nextUnfinished,
        };
        break;
      }

      // First unstarted section
      if (completedCount === 0 && !firstUnstarted) {
        firstUnstarted = {
          section,
          module: mod,
          total: items.length,
          completed: 0,
          nextItem: items[0] || null,
        };
      }
    }

    const chosen = firstInProgress || firstUnstarted;
    if (chosen) {
      const percent = chosen.total > 0 ? Math.round((chosen.completed / chosen.total) * 100) : 0;
      return {
        module: chosen.module,
        section: chosen.section,
        totalItems: chosen.total,
        completedItems: chosen.completed,
        progressPercent: percent,
        nextItem: chosen.nextItem,
        isCompleted: chosen.completed === chosen.total && chosen.total > 0,
      };
    }

    // Fallback if everything completed or empty
    const firstSec = curriculum[0];
    const items = firstSec?.items || [];
    return {
      module: defaultModule,
      section: firstSec || null,
      totalItems: items.length || 10,
      completedItems: items.length || 10,
      progressPercent: 100,
      nextItem: null,
      isCompleted: true,
    };
  }, [curriculum, userStates]);

  return {
    user,
    loadingUser,
    potd,
    loadingPotd,
    curriculum,
    userStates,
    loadingLearning,
    activeTopicProgress,
  };
}
