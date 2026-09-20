"use client";

import React from "react";
import { HERO_SOCIAL_LOGOS } from "@/app/pro/_config/pro-logos";
import { Star, Users, Video, Code2, Youtube, TrendingUp, CheckCircle } from "lucide-react";

export function SocialProof() {
  const reachCards = [
    {
      platform: "DSA Lectures",
      stat: "150+ Lectures",
      subtext: "Whiteboards & Hands-On Coding",
      handle: "Interview Focused ",
      icon: Youtube,
      color: "text-red-500 bg-red-500/10 border-red-500/20",
    },
    {
      platform: "Editorial Solutions",
      stat: "500+ Problems",
      subtext: "Post Contest Editorials & Solutions",
      handle: "Top Sheets",
      icon: Code2,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      platform: "Students",
      stat: "50,000+",
      subtext: "From 100+ Colleges & 20+ Countries",
      handle: "Across Different Platforms",
      icon: Users,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      platform: "Student Rating",
      stat: "4.9 / 5.0 ★",
      subtext: "Based on 1,500+ Verified Reviews",
      handle: "Top Rated SDE Resource",
      icon: Star,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <section className="py-14 sm:py-20 border-y border-border/70 bg-muted/20 relative overflow-hidden">
      {/* Background Ambient Glow (TUF reach visual glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-xs uppercase font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400">
            coding75 Pro
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Trusted by Thousands of Students 
          </h2>
        </div>

        {/* Floating Social Numbers / Reach Cards (TUF Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reachCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group relative p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between pb-3">
                  <div className={`p-2 rounded-xl border ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                    {card.handle}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-black text-foreground font-mono tracking-tight">
                    {card.stat}
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {card.platform}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {card.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Placement Companies Header & Marquee */}
        <div className="pt-4 text-center space-y-5">
          <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
            Students & Mentors Work Across Global Product Companies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
            {HERO_SOCIAL_LOGOS.map((logo) =>
              logo.logoDarkUrl ? (
                <React.Fragment key={logo.id}>
                  <img
                    src={logo.logoUrl}
                    alt={logo.alt}
                    className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                      logo.themeClass || ""
                    } object-contain dark:hidden`}
                  />
                  <img
                    src={logo.logoDarkUrl}
                    alt={logo.alt}
                    className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                      logo.themeClass || ""
                    } object-contain hidden dark:inline-block`}
                  />
                </React.Fragment>
              ) : (
                <img
                  key={logo.id}
                  src={logo.logoUrl}
                  alt={logo.alt}
                  className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                    logo.themeClass || ""
                  } object-contain`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
