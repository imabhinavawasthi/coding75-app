import React from "react";
import Link from "next/link";
import { ChevronRight, Dumbbell, BookOpen, Hash, Rocket } from "lucide-react";

interface DSASheet {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  level?: string;
  total_topics?: number;
  total_problems?: number;
  sheet_json?: any;
}

// Helper to count total problems
function getProblemCount(sheet: DSASheet): number {
  if (sheet.total_problems !== undefined) return sheet.total_problems;
  if (!sheet.sheet_json || !sheet.sheet_json.topics) return 0;
  return sheet.sheet_json.topics.reduce((acc: number, topic: any) => {
    const topicProblems = topic.steps?.reduce((acc2: number, step: any) => {
      return acc2 + (step.problems ? step.problems.length : 0);
    }, 0) || 0;
    return acc + topicProblems;
  }, 0);
}

// Helper to count total topics
function getTopicCount(sheet: DSASheet): number {
  if (sheet.total_topics !== undefined) return sheet.total_topics;
  if (!sheet.sheet_json || !sheet.sheet_json.topics) return 0;
  return sheet.sheet_json.topics.length;
}

export default function DSASheetCard({ sheet }: { sheet: DSASheet }) {
  // Generate a random gradient based on the sheet ID character length
  const gradients = [
    "from-blue-600 to-cyan-500",
    "from-violet-600 to-fuchsia-500",
    "from-emerald-500 to-teal-400",
    "from-amber-500 to-orange-400",
    "from-rose-500 to-pink-500",
  ];
  const gradient = gradients[sheet.id.length % gradients.length];
  const isExpert = sheet.id === "expert-sheet";

  return (
    <Link 
      href={`/dsa/sheets/${sheet.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-xl transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Top Banner */}
      <div className={`relative h-[120px] bg-gradient-to-br ${gradient} p-5 flex flex-col justify-between overflow-hidden`}>
        {/* Glow */}
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/20 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        
        {isExpert ? (
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
             <Rocket size={80} className="text-white" />
           </div>
        ) : (
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
             <BookOpen size={80} className="text-white" />
           </div>
        )}

        <div className="absolute top-4 left-4 z-10">
          <span className="rounded-md bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
            {sheet.level || "mixed"}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-10">
        <h3 className="text-lg font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary">
          {sheet.title}
        </h3>
        
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed flex-grow line-clamp-3 font-medium">
          {sheet.description || "A comprehensive collection of data structures and algorithm problems to master your coding skills."}
        </p>

        {/* Tags */}
        {sheet.tags && sheet.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {sheet.tags.slice(0, 3).map(tag => (
              <span key={tag} className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                <Hash size={10} />
                {tag}
              </span>
            ))}
            {sheet.tags.length > 3 && (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                +{sheet.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Dumbbell size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">{getProblemCount(sheet)}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Problems</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <BookOpen size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">{getTopicCount(sheet)}</span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Topics</span>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-3.5 text-xs font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm group-hover:shadow-primary/25">
          <span>Start Practice</span>
          <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  );
}
