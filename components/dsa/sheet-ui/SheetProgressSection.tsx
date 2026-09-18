import React from "react";
import { DetailedProblem } from "@/types/dsa-sheet";
import { Clock, PlayCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface SheetProgressSectionProps {
  totalProblems: number;
  solvedCount: number;
  progressPercentage: number;
  firstPendingProblem: any;
  nextProblemDetailed: DetailedProblem | null;
  sheetId?: string;
  topicTitle?: string;
}

export const SheetProgressSection: React.FC<SheetProgressSectionProps> = ({
  totalProblems,
  solvedCount,
  progressPercentage,
  firstPendingProblem,
  nextProblemDetailed,
  sheetId,
  topicTitle,
}) => {
  if (totalProblems === 0) return null;

  return (
    <div className="mt-5 w-full">
      <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-md shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="w-full md:w-[60%] relative z-10">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h3 className="text-white font-bold text-base mb-0.5 flex items-center gap-2 tracking-tight">
                Course Progress
              </h3>
              <p className="text-white/70 text-xs font-medium">
                {solvedCount} out of {totalProblems} problems solved
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary-400">
                {progressPercentage}%
              </span>
            </div>
          </div>

          {/* Compact premium progress bar */}
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-green-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Next Problem Card CTA */}
        {firstPendingProblem ? (
          <div className="w-full md:w-[40%] relative z-10 flex flex-col items-start md:border-l border-white/10 md:pl-5 pt-3 md:pt-0 border-t md:border-t-0 mt-3 md:mt-0">
            <span className="text-primary-300 text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
              <Clock size={12} strokeWidth={2.5} /> Up Next
            </span>
            <Link
              href={(() => {
                const targetSlug = nextProblemDetailed?.slug || firstPendingProblem.problem_id;
                const params = new URLSearchParams();
                if (sheetId) params.set("sheet", sheetId);
                if (topicTitle) params.set("topic", topicTitle);
                const query = params.toString() ? `?${params.toString()}` : "";
                return `/dsa/problem/${targetSlug}${query}`;
              })()}
              className="group w-full flex items-center justify-between bg-primary-600 hover:bg-primary-500 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-md shadow-primary-500/20 hover:shadow-primary-500/40 border border-primary-500/50 hover:border-primary-400"
            >
              <div className="flex flex-col min-w-0 pr-3">
                <span className="font-semibold text-sm truncate capitalize">
                  {nextProblemDetailed?.title ||
                    firstPendingProblem.title ||
                    firstPendingProblem.problem_id.replace(/[-_]/g, " ")}
                </span>
                <span className="text-white/80 text-[10px] mt-0.5 truncate flex items-center gap-1.5 font-medium">
                  <span
                    className={
                      nextProblemDetailed?.difficulty === "Easy"
                        ? "text-green-300"
                        : nextProblemDetailed?.difficulty === "Hard"
                        ? "text-red-300"
                        : "text-amber-300"
                    }
                  >
                    {nextProblemDetailed?.difficulty ||
                      firstPendingProblem.difficulty ||
                      "Medium"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  {(() => {
                    const platform = nextProblemDetailed?.platform;
                    const url = nextProblemDetailed?.problem_url || firstPendingProblem.problem_url;
                    if (platform) return platform;
                    if (url?.includes("leetcode.com")) return "LeetCode";
                    if (url?.includes("geeksforgeeks.org")) return "GFG";
                    if (url?.includes("codeforces.com")) return "Codeforces";
                    if (url?.includes("codechef.com")) return "CodeChef";
                    return "Solve Now";
                  })()}
                </span>
              </div>
              <PlayCircle
                size={18}
                className="shrink-0 group-hover:scale-110 transition-transform"
              />
            </Link>
          </div>
        ) : (
          <div className="w-full md:w-[40%] relative z-10 flex items-center justify-center gap-3 md:border-l border-white/10 md:pl-5 pt-3 md:pt-0 border-t md:border-t-0 mt-3 md:mt-0">
            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-white font-bold text-sm block">
                All Caught Up!
              </span>
              <span className="text-white/70 text-xs">Sheet completed.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
