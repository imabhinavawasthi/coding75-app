"use client";

import React from "react";
import Link from "next/link";
import { Play, Lock, Clock } from "lucide-react";
import { DSATopicModule, getTopicGradient, getTopicGradientStyle } from "@/config/dsa-catalog";

interface DSATopicCardProps {
  module: DSATopicModule;
  isLoading?: boolean;
}

// Unique SVG background graphics for each topic module
function CardBackgroundGraphic({ id }: { id: string }) {
  switch (id) {
    case "complexity-foundations":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          {/* Coordinate axes */}
          <line x1="25" y1="135" x2="175" y2="135" stroke="white" strokeWidth="2.5" strokeOpacity="0.4" />
          <line x1="25" y1="135" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeOpacity="0.4" />
          {/* O(1) horizontal line */}
          <line x1="25" y1="115" x2="170" y2="115" stroke="white" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 3" />
          {/* O(n) line */}
          <line x1="25" y1="135" x2="160" y2="40" stroke="white" strokeWidth="2.5" strokeOpacity="0.35" />
          {/* O(n^2) steep curve */}
          <path d="M25 135 Q 85 130, 115 30" stroke="white" strokeWidth="3" strokeOpacity="0.45" fill="none" />
          {/* Big O symbol badge */}
          <circle cx="150" cy="50" r="24" stroke="white" strokeWidth="4" strokeOpacity="0.3" fill="white" fillOpacity="0.1" />
          <text x="150" y="56" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="16" fontWeight="bold" fontFamily="monospace">O(n)</text>
        </svg>
      );
    case "prog-foundations":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          {/* Code editor window frame */}
          <rect x="30" y="30" width="140" height="95" rx="8" stroke="white" strokeWidth="3" strokeOpacity="0.35" fill="white" fillOpacity="0.06" />
          <circle cx="46" cy="45" r="4" fill="white" fillOpacity="0.4" />
          <circle cx="58" cy="45" r="4" fill="white" fillOpacity="0.4" />
          <circle cx="70" cy="45" r="4" fill="white" fillOpacity="0.4" />
          {/* Code lines */}
          <line x1="45" y1="65" x2="90" y2="65" stroke="white" strokeWidth="3" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="55" y1="78" x2="120" y2="78" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
          <line x1="55" y1="91" x2="140" y2="91" stroke="white" strokeWidth="3" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="45" y1="104" x2="80" y2="104" stroke="white" strokeWidth="3" strokeOpacity="0.25" strokeLinecap="round" />
        </svg>
      );
    case "math-dsa":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          {/* Summation Sigma */}
          <path d="M60 40 H110 L80 80 L110 120 H60" stroke="white" strokeWidth="4" strokeOpacity="0.35" strokeLinejoin="round" fill="none" />
          {/* Pi symbol */}
          <path d="M125 55 H165 M135 55 V105 M155 55 V105" stroke="white" strokeWidth="3.5" strokeOpacity="0.3" strokeLinecap="round" />
          {/* Modular / division circle */}
          <circle cx="145" cy="115" r="18" stroke="white" strokeWidth="3" strokeOpacity="0.25" fill="white" fillOpacity="0.08" />
          <line x1="135" y1="125" x2="155" y2="105" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
        </svg>
      );
    case "problem-solving-mindset":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          {/* Lightbulb intuition */}
          <path d="M100 35 C80 35, 68 50, 68 68 C68 80, 78 92, 85 100 H115 C122 92, 132 80, 132 68 C132 50, 120 35, 100 35 Z" stroke="white" strokeWidth="3.5" strokeOpacity="0.35" fill="white" fillOpacity="0.08" />
          <line x1="88" y1="108" x2="112" y2="108" stroke="white" strokeWidth="3" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="92" y1="116" x2="108" y2="116" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
          {/* Glowing rays */}
          <line x1="100" y1="20" x2="100" y2="28" stroke="white" strokeWidth="3" strokeOpacity="0.4" strokeLinecap="round" />
          <line x1="60" y1="35" x2="67" y2="42" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
          <line x1="140" y1="35" x2="133" y2="42" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
          <line x1="45" y1="68" x2="55" y2="68" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
          <line x1="155" y1="68" x2="145" y2="68" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
        </svg>
      );
    case "arrays":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <rect x="20" y="90" width="32" height="32" rx="6" stroke="white" strokeWidth="3" strokeOpacity="0.3" fill="white" fillOpacity="0.05" />
          <rect x="58" y="90" width="32" height="32" rx="6" stroke="white" strokeWidth="3" strokeOpacity="0.3" fill="white" fillOpacity="0.1" />
          <rect x="96" y="90" width="32" height="32" rx="6" stroke="white" strokeWidth="3" strokeOpacity="0.4" fill="white" fillOpacity="0.2" />
          <rect x="134" y="90" width="32" height="32" rx="6" stroke="white" strokeWidth="3" strokeOpacity="0.3" fill="white" fillOpacity="0.05" />
          <circle cx="160" cy="40" r="50" stroke="white" strokeWidth="8" strokeOpacity="0.2" />
        </svg>
      );
    case "strings":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <path d="M30 40 Q 90 100, 170 30" stroke="white" strokeWidth="6" strokeOpacity="0.3" fill="none" />
          <path d="M20 70 Q 100 130, 180 60" stroke="white" strokeWidth="4" strokeOpacity="0.2" strokeDasharray="6 6" fill="none" />
          <circle cx="140" cy="110" r="35" stroke="white" strokeWidth="10" strokeOpacity="0.25" />
        </svg>
      );
    case "linked-list":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <circle cx="35" cy="100" r="18" stroke="white" strokeWidth="4" strokeOpacity="0.35" fill="white" fillOpacity="0.1" />
          <path d="M53 100 L85 100" stroke="white" strokeWidth="4" strokeOpacity="0.4" strokeDasharray="4 2" />
          <circle cx="103" cy="100" r="18" stroke="white" strokeWidth="4" strokeOpacity="0.4" fill="white" fillOpacity="0.2" />
          <path d="M121 100 L153 100" stroke="white" strokeWidth="4" strokeOpacity="0.4" strokeDasharray="4 2" />
          <circle cx="171" cy="100" r="18" stroke="white" strokeWidth="4" strokeOpacity="0.35" fill="white" fillOpacity="0.1" />
          <circle cx="160" cy="30" r="45" stroke="white" strokeWidth="6" strokeOpacity="0.15" />
        </svg>
      );
    case "stack-queue":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <path d="M120 40 V 130 H 180 V 40" stroke="white" strokeWidth="5" strokeOpacity="0.35" fill="none" />
          <rect x="126" y="102" width="48" height="20" rx="4" fill="white" fillOpacity="0.3" />
          <rect x="126" y="76" width="48" height="20" rx="4" fill="white" fillOpacity="0.2" />
          <rect x="126" y="50" width="48" height="20" rx="4" fill="white" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="8" strokeOpacity="0.2" />
        </svg>
      );
    case "hashing-maps":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          {/* Key -> Hash -> Bucket */}
          <rect x="30" y="45" width="40" height="22" rx="5" stroke="white" strokeWidth="3" strokeOpacity="0.35" fill="white" fillOpacity="0.1" />
          <rect x="30" y="75" width="40" height="22" rx="5" stroke="white" strokeWidth="3" strokeOpacity="0.35" fill="white" fillOpacity="0.1" />
          <rect x="30" y="105" width="40" height="22" rx="5" stroke="white" strokeWidth="3" strokeOpacity="0.35" fill="white" fillOpacity="0.1" />
          <path d="M70 56 L120 75 M70 86 L120 75 M70 116 L120 115" stroke="white" strokeWidth="2.5" strokeOpacity="0.35" strokeDasharray="3 2" />
          <rect x="120" y="40" width="55" height="95" rx="6" stroke="white" strokeWidth="3" strokeOpacity="0.35" fill="white" fillOpacity="0.08" />
          <line x1="120" y1="72" x2="175" y2="72" stroke="white" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="120" y1="104" x2="175" y2="104" stroke="white" strokeWidth="2" strokeOpacity="0.25" />
        </svg>
      );
    case "trees":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <circle cx="130" cy="30" r="14" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="3" />
          <line x1="120" y1="42" x2="90" y2="78" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
          <line x1="140" y1="42" x2="170" y2="78" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
          <circle cx="90" cy="90" r="12" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="3" />
          <circle cx="170" cy="90" r="12" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="3" />
          <line x1="80" y1="100" x2="60" y2="128" stroke="white" strokeWidth="3" strokeOpacity="0.2" />
          <circle cx="55" cy="135" r="10" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2" />
        </svg>
      );
    case "heaps":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <polygon points="140,25 90,125 190,125" stroke="white" strokeWidth="4" strokeOpacity="0.3" fill="white" fillOpacity="0.05" />
          <line x1="115" y1="75" x2="165" y2="75" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
          <line x1="140" y1="25" x2="140" y2="125" stroke="white" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 4" />
          <circle cx="45" cy="50" r="35" stroke="white" strokeWidth="6" strokeOpacity="0.15" />
        </svg>
      );
    case "graphs":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <line x1="40" y1="40" x2="120" y2="30" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
          <line x1="120" y1="30" x2="170" y2="90" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
          <line x1="40" y1="40" x2="80" y2="120" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
          <line x1="80" y1="120" x2="170" y2="90" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
          <line x1="120" y1="30" x2="80" y2="120" stroke="white" strokeWidth="3" strokeOpacity="0.25" />
          <circle cx="40" cy="40" r="12" fill="white" fillOpacity="0.3" />
          <circle cx="120" cy="30" r="14" fill="white" fillOpacity="0.35" />
          <circle cx="170" cy="90" r="13" fill="white" fillOpacity="0.3" />
          <circle cx="80" cy="120" r="11" fill="white" fillOpacity="0.25" />
        </svg>
      );
    case "two-pointers-window":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <rect x="40" y="80" width="120" height="45" rx="8" stroke="white" strokeWidth="4" strokeOpacity="0.35" fill="white" fillOpacity="0.1" />
          <path d="M20 102 L40 102 M32 94 L40 102 L32 110" stroke="white" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.5" />
          <path d="M180 102 L160 102 M168 94 L160 102 L168 110" stroke="white" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.5" />
          <circle cx="150" cy="35" r="40" stroke="white" strokeWidth="6" strokeOpacity="0.15" />
        </svg>
      );
    case "binary-search":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <circle cx="140" cy="75" r="60" stroke="white" strokeWidth="3" strokeOpacity="0.2" />
          <circle cx="140" cy="75" r="40" stroke="white" strokeWidth="4" strokeOpacity="0.3" />
          <circle cx="140" cy="75" r="15" fill="white" fillOpacity="0.35" />
          <line x1="140" y1="5" x2="140" y2="145" stroke="white" strokeWidth="3" strokeOpacity="0.25" strokeDasharray="6 4" />
          <line x1="70" y1="75" x2="210" y2="75" stroke="white" strokeWidth="3" strokeOpacity="0.25" strokeDasharray="6 4" />
        </svg>
      );
    case "sorting-comparators":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          {/* Sorted bars */}
          <rect x="30" y="105" width="18" height="30" rx="3" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" fill="white" fillOpacity="0.1" />
          <rect x="58" y="85" width="18" height="50" rx="3" stroke="white" strokeWidth="2.5" strokeOpacity="0.35" fill="white" fillOpacity="0.15" />
          <rect x="86" y="65" width="18" height="70" rx="3" stroke="white" strokeWidth="2.5" strokeOpacity="0.4" fill="white" fillOpacity="0.2" />
          <rect x="114" y="45" width="18" height="90" rx="3" stroke="white" strokeWidth="2.5" strokeOpacity="0.45" fill="white" fillOpacity="0.25" />
          <rect x="142" y="25" width="18" height="110" rx="3" stroke="white" strokeWidth="2.5" strokeOpacity="0.5" fill="white" fillOpacity="0.3" />
          {/* Comparator arrow */}
          <path d="M40 30 Q 90 15, 140 18" stroke="white" strokeWidth="3" strokeOpacity="0.4" strokeDasharray="4 2" fill="none" />
        </svg>
      );
    case "recursion-backtracking":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          {/* Decision tree call stack */}
          <circle cx="100" cy="30" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.4" fill="white" fillOpacity="0.2" />
          <line x1="93" y1="38" x2="60" y2="70" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" />
          <line x1="107" y1="38" x2="140" y2="70" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" />
          <circle cx="60" cy="75" r="9" stroke="white" strokeWidth="2.5" strokeOpacity="0.35" fill="white" fillOpacity="0.15" />
          <circle cx="140" cy="75" r="9" stroke="white" strokeWidth="2.5" strokeOpacity="0.35" fill="white" fillOpacity="0.15" />
          {/* Return curved arrows */}
          <path d="M50 82 Q 40 100, 60 115" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="3 2" fill="none" />
          <path d="M150 82 Q 160 100, 140 115" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="3 2" fill="none" />
          <circle cx="60" cy="120" r="8" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="white" fillOpacity="0.1" />
          <circle cx="140" cy="120" r="8" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="white" fillOpacity="0.1" />
        </svg>
      );
    case "dp":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <rect x="80" y="30" width="100" height="100" rx="8" stroke="white" strokeWidth="3" strokeOpacity="0.35" fill="white" fillOpacity="0.05" />
          <line x1="80" y1="63" x2="180" y2="63" stroke="white" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="80" y1="96" x2="180" y2="96" stroke="white" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="113" y1="30" x2="113" y2="130" stroke="white" strokeWidth="2" strokeOpacity="0.25" />
          <line x1="146" y1="30" x2="146" y2="130" stroke="white" strokeWidth="2" strokeOpacity="0.25" />
          <rect x="115" y="65" width="29" height="29" fill="white" fillOpacity="0.3" rx="4" />
          <circle cx="35" cy="50" r="25" stroke="white" strokeWidth="6" strokeOpacity="0.15" />
        </svg>
      );
    case "greedy":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          {/* Interval segments */}
          <rect x="30" y="45" width="60" height="14" rx="4" stroke="white" strokeWidth="2.5" strokeOpacity="0.35" fill="white" fillOpacity="0.15" />
          <rect x="80" y="70" width="70" height="14" rx="4" stroke="white" strokeWidth="2.5" strokeOpacity="0.4" fill="white" fillOpacity="0.25" />
          <rect x="135" y="95" width="45" height="14" rx="4" stroke="white" strokeWidth="2.5" strokeOpacity="0.35" fill="white" fillOpacity="0.15" />
          <circle cx="50" cy="115" r="25" stroke="white" strokeWidth="4" strokeOpacity="0.2" />
          <path d="M35 125 L65 95" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeDasharray="3 2" />
        </svg>
      );
    case "bit-manipulation":
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          {/* 0101 bit stream */}
          <text x="35" y="60" fill="white" fillOpacity="0.35" fontSize="24" fontWeight="black" fontFamily="monospace">0 1 1 0</text>
          <text x="35" y="95" fill="white" fillOpacity="0.3" fontSize="24" fontWeight="black" fontFamily="monospace">1 0 1 1</text>
          <line x1="30" y1="108" x2="160" y2="108" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
          <text x="35" y="130" fill="white" fillOpacity="0.45" fontSize="24" fontWeight="black" fontFamily="monospace">1 1 0 1</text>
          <circle cx="155" cy="50" r="25" stroke="white" strokeWidth="6" strokeOpacity="0.2" />
        </svg>
      );
    default:
      return (
        <svg className="w-full h-full" viewBox="0 0 200 160" fill="none">
          <circle cx="150" cy="45" r="55" stroke="white" strokeWidth="10" strokeOpacity="0.25" />
          <circle cx="160" cy="130" r="35" stroke="white" strokeWidth="6" strokeOpacity="0.2" fill="white" fillOpacity="0.08" />
          <path d="M-10 140 L130 30" stroke="white" strokeWidth="6" strokeOpacity="0.2" strokeDasharray="8 6" />
        </svg>
      );
  }
}

export function DSATopicCard({ module, isLoading }: DSATopicCardProps) {
  if (isLoading) {
    return (
      <div className="relative w-[280px] sm:w-[310px] overflow-hidden rounded-2xl border border-border bg-card shadow-xs flex flex-col shrink-0 animate-pulse">
        {/* Skeleton Top Banner */}
        <div className="relative h-[165px] p-5 flex flex-col justify-between bg-muted/70">
          <div className="h-3 w-24 bg-muted-foreground/30 rounded-full" />
          <div className="space-y-2 pr-6 pb-2">
            <div className="h-5 w-4/5 bg-muted-foreground/30 rounded-md" />
            <div className="h-4 w-3/5 bg-muted-foreground/30 rounded-md" />
          </div>
        </div>

        {/* Skeleton Action Button */}
        <div className="absolute right-4 top-[141px] z-30 flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground/30 border-2 border-border" />

        {/* Skeleton Bottom Bar */}
        <div className="px-5 pt-5 pb-4 bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="space-y-1">
              <div className="h-4 w-8 bg-muted-foreground/20 rounded" />
              <div className="h-2 w-12 bg-muted-foreground/20 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-4 w-8 bg-muted-foreground/20 rounded" />
              <div className="h-2 w-12 bg-muted-foreground/20 rounded" />
            </div>
          </div>
          <div className="h-3 w-10 bg-muted-foreground/20 rounded" />
        </div>
      </div>
    );
  }

  const isUpcoming = module.isUpcoming === true;
  const gradient = getTopicGradient(module);
  const gradientStyle = getTopicGradientStyle(module);
  const TopicIcon = module.icon;

  const cardContent = (
    <div
      className={`relative w-[280px] sm:w-[310px] overflow-hidden rounded-2xl border border-border bg-card shadow-xs flex flex-col transition-all duration-300 ${
        isUpcoming
          ? "opacity-90 cursor-not-allowed"
          : "hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
      }`}
    >
      {/* Top Banner with Gradient & Abstract Graphic */}
      <div
        style={{ background: gradientStyle }}
        className={`relative h-[165px] p-5 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${gradient} text-white`}
      >
        {/* Abstract SVG Background Graphic */}
        <div className="absolute inset-0 pointer-events-none">
          <CardBackgroundGraphic id={module.id} />
        </div>

        {/* Glowing ambient orb */}
        <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/20 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

        {/* Subtitle / Category Header with Crisp Topic Icon */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md shadow-xs border border-white/20">
              {TopicIcon && <TopicIcon className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/90 drop-shadow-xs">
              {module.subtitle || module.categoryLabel}
            </span>
          </div>

          {isUpcoming ? (
            <span className="rounded-md bg-amber-400/95 text-gray-950 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Clock size={10} /> Upcoming
            </span>
          ) : (
            module.isPro && (
              <span className="rounded-md bg-amber-400/95 text-gray-950 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                <Lock size={10} /> Pro
              </span>
            )
          )}
        </div>

        {/* Module Title */}
        <div className="relative z-10 pr-6 pb-2">
          <h3 className="text-xl font-black tracking-tight text-white leading-snug drop-shadow-sm line-clamp-2">
            {module.title}
          </h3>
        </div>
      </div>

      {/* Floating Action Button */}
      {isUpcoming ? (
        <div className="absolute right-4 top-[141px] z-30 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900/90 dark:bg-gray-950/90 border-2 border-gray-700 text-amber-400 shadow-md">
          <Clock className="h-5 w-5 text-amber-400" />
        </div>
      ) : (
        <div className="absolute right-4 top-[141px] z-30 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 dark:bg-gray-950 border-2 border-gray-800 text-white shadow-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
          <Play className="h-5 w-5 fill-white text-white ml-0.5" />
        </div>
      )}

      {/* Bottom Bar */}
      <div className="px-5 pt-5 pb-4 bg-muted/30 flex items-center justify-between text-muted-foreground">
        {isUpcoming ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-wider">
              <Clock size={12} /> Coming Soon
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div>
              <span className="text-base font-black text-foreground leading-none block">
                {module.lessonCount ?? 0}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5 block">
                Videos
              </span>
            </div>
            <div>
              <span className="text-base font-black text-foreground leading-none block">
                {module.problemCount ?? 0}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5 block">
                Problems
              </span>
            </div>
            <div>
              <span className="text-base font-black text-foreground leading-none block">
                {module.itemsCount ?? 0}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5 block">
                Total Items
              </span>
            </div>
          </div>
        )}

        <div className="text-right">
          <span
            className={`text-xs font-black ${
              isUpcoming
                ? "text-amber-500 dark:text-amber-400"
                : "text-foreground"
            }`}
          >
            {isUpcoming ? "Upcoming" : `${module.progressPercent ?? 0}%`}
          </span>
        </div>
      </div>
    </div>
  );

  // If Upcoming -> disable navigation link entirely
  if (isUpcoming) {
    return <div className="shrink-0">{cardContent}</div>;
  }

  return (
    <Link href={`/dsa/${module.id}`} className="block group shrink-0">
      {cardContent}
    </Link>
  );
}
