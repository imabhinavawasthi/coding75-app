"use client";

import React from "react";
import { Quote, Star, Building2 } from "lucide-react";
import { PRO_TESTIMONIALS, TestimonialItem } from "../_config/pro-config";

export function ProTestimonials() {
  return (
    <section id="reviews" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header with Blue Theme (matching Top Engineers) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          From coding75 Learners to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Top Tech Engineers
          </span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          See how our live problem-solving classes, 1:1 mentor doubt clearing, and structured curriculum helped students crack competitive tech interviews.
        </p>
      </div>

      {/* Metric Trust Banner (Blue/Indigo accent) */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-card via-card to-blue-500/5 backdrop-blur-xs text-center">
        <div className="space-y-0.5">
          <p className="text-xl sm:text-2xl font-black text-foreground font-mono">4.9 / 5.0</p>
          <p className="text-[11px] font-semibold text-muted-foreground">Student Rating</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xl sm:text-2xl font-black text-foreground font-mono">5,000+</p>
          <p className="text-[11px] font-semibold text-muted-foreground">Engineers Guided</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xl sm:text-2xl font-black text-foreground font-mono">100% Live</p>
          <p className="text-[11px] font-semibold text-muted-foreground">Interactive Doubts</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xl sm:text-2xl font-black text-foreground font-mono">Tier-1 & FAANG</p>
          <p className="text-[11px] font-semibold text-muted-foreground">Alumni Placements</p>
        </div>
      </div>

      {/* Testimonials Luxury 3-Col Grid with Blue Theme & Transparent Logos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRO_TESTIMONIALS.map((item: TestimonialItem, idx: number) => (
          <div
            key={idx}
            className="group relative rounded-3xl border border-blue-500/20 bg-gradient-to-b from-card via-card to-blue-500/5 p-6 sm:p-7 flex flex-col justify-between space-y-5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Top faint quote watermark */}
            <Quote className="absolute top-4 right-4 w-12 h-12 text-foreground/[0.04] group-hover:text-blue-500/10 transition-colors pointer-events-none" />

            <div className="space-y-4">
              {/* Header: Stars + Transparent Company Logo */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground font-mono">5.0</span>
                </div>

                {item.companyLogo ? (
                  <div className="h-6 flex items-center justify-end">
                    {item.companyLogoDark ? (
                      <>
                        <img
                          src={item.companyLogo}
                          alt={item.company}
                          className={`h-5 w-auto max-w-[95px] object-contain opacity-85 group-hover:opacity-100 transition-opacity dark:hidden ${
                            item.companyLogoThemeClass || ""
                          }`}
                        />
                        <img
                          src={item.companyLogoDark}
                          alt={item.company}
                          className={`h-5 w-auto max-w-[95px] object-contain opacity-85 group-hover:opacity-100 transition-opacity hidden dark:inline-block ${
                            item.companyLogoThemeClass || ""
                          }`}
                        />
                      </>
                    ) : (
                      <img
                        src={item.companyLogo}
                        alt={item.company}
                        className={`h-5 w-auto max-w-[95px] object-contain opacity-85 group-hover:opacity-100 transition-opacity ${
                          item.companyLogoThemeClass || ""
                        }`}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold text-primary">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{item.company}</span>
                  </div>
                )}
              </div>

              {/* Quote Body */}
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Author Footer (Preserving user's removal of the verified badge) */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <p className="font-extrabold text-sm text-foreground truncate">{item.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {item.role} • <span className="font-semibold text-foreground">{item.company}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
