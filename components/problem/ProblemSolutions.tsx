"use client";

import React, { useState } from "react";
import { Terminal, Clipboard, Check, Lightbulb } from "lucide-react";
import { highlightCode } from "@/utils/code";

export interface SolutionItem {
  code: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  explanation?: string;
}

export interface ProblemSolutionsData {
  cpp?: SolutionItem;
  python?: SolutionItem;
  java?: SolutionItem;
  javascript?: SolutionItem;
}

interface ProblemSolutionsProps {
  solutions: ProblemSolutionsData;
}

export const ProblemSolutions: React.FC<ProblemSolutionsProps> = ({ solutions }) => {
  const [activeLang, setActiveLang] = useState<"cpp" | "python" | "java" | "javascript">("cpp");
  const [copied, setCopied] = useState(false);

  const activeSolution = solutions[activeLang] || {
    code: `// ${activeLang.toUpperCase()} Solution is not provided`,
    timeComplexity: "",
    spaceComplexity: "",
    explanation: "",
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(activeSolution.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const codeLines = (activeSolution.code || "").split("\n");

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-gray-950 border border-gray-800 flex flex-col overflow-hidden shadow-xl text-gray-200 w-full">
      
      {/* Languages Selection Menu */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-4 sm:px-5 py-3 bg-gray-900/60 border-b border-gray-800 select-none">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-primary-400" />
          <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Solution Explorer</span>
        </div>

        <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800 overflow-x-auto no-scrollbar shrink-0">
          {(["cpp", "python", "java", "javascript"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeLang === lang 
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {lang === "cpp" ? "C++" : lang === "javascript" ? "JS" : lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewport */}
      <div className="flex flex-col max-h-[420px] sm:max-h-[500px] bg-gray-950 font-mono text-xs overflow-hidden relative">
        
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white/60 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer z-10"
          title="Copy Code"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Clipboard size={13} />}
        </button>

        <div className="flex-1 overflow-auto p-4 sm:p-5">
          <table className="w-full border-collapse font-mono">
            <tbody>
              {codeLines.map((line, index) => (
                <tr key={index} className="hover:bg-white/[0.03] transition-colors leading-relaxed">
                  <td className="w-8 sm:w-10 pr-3 sm:pr-4 select-none text-right text-[10px] font-bold text-gray-600 font-mono border-r border-gray-800">
                    {index + 1}
                  </td>
                  <td 
                    className="pl-3 sm:pl-4 font-mono text-xs whitespace-pre text-gray-300"
                    dangerouslySetInnerHTML={{ __html: highlightCode(line, activeLang) }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complexity + Explanation Panel */}
      <div className="bg-gray-900/90 border-t border-gray-800 p-4 sm:p-5 space-y-3 sm:space-y-4 select-none">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Time Complexity</span>
            <span className="text-xs font-bold text-primary-400 mt-1">{activeSolution.timeComplexity || "O(N)"}</span>
          </div>
          <div className="w-[1px] h-8 bg-gray-800 shrink-0 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Space Complexity</span>
            <span className="text-xs font-bold text-primary-400 mt-1">{activeSolution.spaceComplexity || "O(1)"}</span>
          </div>
        </div>

        {activeSolution.explanation && (
          <div className="flex gap-2.5 bg-gray-950/50 rounded-xl p-3 sm:p-3.5 border border-gray-800/60">
            <Lightbulb size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] font-semibold leading-relaxed text-gray-300">
              {activeSolution.explanation}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProblemSolutions;
