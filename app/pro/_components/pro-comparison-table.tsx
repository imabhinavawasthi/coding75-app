"use client";

import React from "react";
import { Check, X, Sparkles } from "lucide-react";
import { PRO_COMPARISON_MATRIX, ComparisonItem } from "../_config/pro-config";

export function ProComparisonTable() {
  return (
    <section id="comparison" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header with Blue Theme (Preserving user's removal of eyebrow badge) */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          How coding75 Pro Compares to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Other Platforms
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          See why ambitious developers choose coding75 Pro over high-priced bootcamps and outdated generic platforms.
        </p>
      </div>

      {/* Comparison Table Container with Blue Theme */}
      <div className="rounded-3xl border border-blue-500/20 bg-card overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-xs sm:text-sm">
                <th className="p-4 sm:p-5 font-bold text-foreground w-[34%]">
                  Feature & Experience
                </th>
                <th className="p-4 sm:p-5 font-black text-blue-700 dark:text-blue-300 bg-blue-500/10 border-x border-blue-500/20 text-center w-[26%]">
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>coding75 Pro</span>
                  </div>
                  <span className="text-[10px] font-mono block text-muted-foreground font-normal mt-0.5">
                    From ₹16 / day
                  </span>
                </th>
                <th className="p-4 sm:p-5 font-bold text-muted-foreground text-center w-[20%]">
                  <span>Legacy Bootcamps</span>
                  <span className="text-[10px] block text-muted-foreground/70 font-normal mt-0.5">
                    ₹50,000 – ₹1.5 Lakhs
                  </span>
                </th>
                <th className="p-4 sm:p-5 font-bold text-muted-foreground text-center w-[20%]">
                  <span>Generic Platforms</span>
                  <span className="text-[10px] block text-muted-foreground/70 font-normal mt-0.5">
                    Static Video Playlists
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
              {PRO_COMPARISON_MATRIX.map((row: ComparisonItem, idx: number) => {
                return (
                  <tr
                    key={idx}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {/* Feature name & description */}
                    <td className="p-4 sm:p-5 space-y-1">
                      <p className="font-bold text-foreground">{row.feature}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {row.description}
                      </p>
                    </td>

                    {/* coding75 Pro column (highlighted in blue theme) */}
                    <td className="p-4 sm:p-5 bg-blue-500/5 border-x border-blue-500/20 text-center font-bold text-foreground">
                      <div className="flex flex-col items-center justify-center gap-1 text-primary">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-semibold text-xs sm:text-sm text-foreground">
                            {row.coding75Pro.value}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Legacy Bootcamps */}
                    <td className="p-4 sm:p-5 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-1 text-xs">
                        {row.bootcamps.positive ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-[11px] leading-tight max-w-[160px]">
                          {row.bootcamps.value}
                        </span>
                      </div>
                    </td>

                    {/* Generic Platforms */}
                    <td className="p-4 sm:p-5 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-1 text-xs">
                        {row.genericPlatforms.positive ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-[11px] leading-tight max-w-[160px]">
                          {row.genericPlatforms.value}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
