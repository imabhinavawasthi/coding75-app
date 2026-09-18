import React, { useState } from "react";
import { DSASheet } from "@/types/dsa-sheet";
import { BookOpen, Layers, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface SheetHeaderCardProps {
  sheet: DSASheet;
  totalProblems: number;
  totalTopics: number;
  children?: React.ReactNode;
}

export const SheetHeaderCard: React.FC<SheetHeaderCardProps> = ({
  sheet,
  totalProblems,
  totalTopics,
  children,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="relative -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-6 overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 dark:from-primary-700 dark:via-primary-600 dark:to-primary-500">
      {/* Decorative mesh */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.04]" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/[0.04]" />

      <div className="relative z-10 px-5 md:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between max-w-7xl mx-auto">
          
          {/* Left: Content */}
          <div className="flex-1 space-y-3 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2"
            >
              {sheet.level && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white border border-white/10 backdrop-blur-md">
                  <Target size={12} className="text-white" />
                  {sheet.level}
                </span>
              )}
              {sheet.tags && sheet.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white border border-white/5 backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1.5 tracking-tight">
                {sheet.title || "DSA Learning Sheet"}
              </h1>
              
              <div className="relative">
                <p className={`text-white/80 text-sm leading-relaxed font-medium ${!isDescriptionExpanded ? "line-clamp-2" : ""}`}>
                  {sheet.description || "A structured roadmap guiding you step-by-step through essential DSA patterns and problem-solving techniques."}
                </p>
                {sheet.description && sheet.description.length > 120 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-white font-bold text-xs mt-1.5 hover:text-white/80 transition-colors underline decoration-white/30 underline-offset-2"
                  >
                    {isDescriptionExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Compact Premium Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto"
          >
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-md rounded-lg px-3 py-2 flex-1 md:w-48">
              <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center text-white shrink-0">
                <BookOpen size={14} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider leading-none mb-1">Topics</div>
                <div className="text-sm font-bold text-white leading-none">{totalTopics}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-md rounded-lg px-3 py-2 flex-1 md:w-48">
              <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center text-white shrink-0">
                <Layers size={14} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider leading-none mb-1">Problems</div>
                <div className="text-sm font-bold text-white leading-none">{totalProblems}</div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Children (Progress bar) */}
        {children && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 md:mt-8 max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
};
