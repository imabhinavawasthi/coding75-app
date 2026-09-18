"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import ExpertSheetView from "./_components/expert-sheet-view";
import { SheetContentView } from "@/components/dsa/sheet-ui/SheetContentView";
import supabase from "@/supabase";

export default function SheetPage() {
  const params = useParams();
  const sheet = params.sheet as string;

  const [sheetData, setSheetData] = useState<any>(null);
  const [detailedProblems, setDetailedProblems] = useState<any[]>([]);
  const [userProblemStates, setUserProblemStates] = useState<Record<string, string>>({});
  const [bookmarkedProblemIds, setBookmarkedProblemIds] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (sheet === "expert-sheet") {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);

      // 1. Fetch sheet
      const { data: sheetResult, error: sheetError } = await supabase
        .from("dsa_sheets")
        .select("*")
        .eq("id", sheet)
        .single();

      if (sheetError || !sheetResult) {
        setNotFoundError(true);
        setLoading(false);
        return;
      }
      setSheetData(sheetResult);

      // 2. Collect all problem slugs from sheet_json
      const problemSlugs = new Set<string>();
      sheetResult.sheet_json?.topics?.forEach((topic: any) => {
        topic.steps?.forEach((step: any) => {
          step.problems?.forEach((prob: any) => {
            if (prob.problem_id) problemSlugs.add(prob.problem_id);
          });
        });
      });

      // 3. Fetch detailed problems (id, slug, title, difficulty, problem_url, platform)
      let fetchedProblems: any[] = [];
      if (problemSlugs.size > 0) {
        const { data: problemsData } = await supabase
          .from("practice_problems")
          .select("id, slug, title, difficulty, problem_url, platform")
          .in("slug", Array.from(problemSlugs));
        if (problemsData) fetchedProblems = problemsData;
      }
      setDetailedProblems(fetchedProblems);

      // 4. Check auth and fetch user states
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);

        // Get the UUIDs for these problems
        const problemIds = fetchedProblems.map(p => p.id);

        const { data: statesData } = await supabase
          .from("user_asset_states")
          .select("asset_id, status, is_bookmarked")
          .eq("user_id", user.id)
          .in("asset_id", problemIds);

        if (statesData) {
          const states: Record<string, string> = {};
          const bookmarks: string[] = [];
          statesData.forEach(s => {
            states[s.asset_id] = s.status;
            if (s.is_bookmarked) bookmarks.push(s.asset_id);
          });
          setUserProblemStates(states);
          setBookmarkedProblemIds(bookmarks);
        }
      }

      setLoading(false);
    };

    load();
  }, [sheet]);

  if (sheet === "expert-sheet") return <ExpertSheetView />;

  if (notFoundError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
        <h2 className="text-2xl font-black text-foreground">Sheet Not Found</h2>
        <p className="text-muted-foreground text-sm">The sheet you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  if (loading || !sheetData) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-20 space-y-6">
        <div className="h-48 rounded-3xl bg-muted animate-pulse" />
        <div className="h-24 rounded-2xl bg-muted animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-20">
      <SheetContentView
        sheet={sheetData}
        sheetProblems={detailedProblems}
        userProblemStates={userProblemStates}
        bookmarkedProblemIds={bookmarkedProblemIds}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
