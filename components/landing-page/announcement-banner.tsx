"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, Clock, Flame } from "lucide-react";

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    hours: 11,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    // Calculates target: Next day 12:00 PM (noon)
    const getNextDayNoon = () => {
      const now = new Date();
      const target = new Date(now);
      target.setDate(target.getDate() + 1);
      target.setHours(12, 0, 0, 0);
      return target.getTime();
    };

    const calculateTimeLeft = () => {
      const now = Date.now();
      let targetTime = 0;

      try {
        const stored = localStorage.getItem("coding75_announcement_deadline_v2");
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (parsed > now) {
            targetTime = parsed;
          }
        }
      } catch {
        // localStorage unavailable (SSR/private mode)
      }

      if (!targetTime) {
        targetTime = getNextDayNoon();
        try {
          localStorage.setItem("coding75_announcement_deadline_v2", targetTime.toString());
        } catch {
          // ignore
        }
      }

      const diff = Math.max(0, targetTime - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="relative z-50 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white border-b border-blue-500/20 text-xs py-2 px-3 sm:px-4 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left / Center: Announcement Content */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
          {/* Pulsing Tag */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
            <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>coding75 Pro - 50% off</span>
          </div>

          {/* Offer Title */}
          <span className="hidden md:inline font-semibold text-slate-200">
            Live Masterclasses & Doubt Sessions • Complete DSA • Interview Prep • Placement Guidance
          </span>
          <span className="md:hidden font-medium text-slate-200 text-[11px]">
            Live Masterclasses & Doubt Sessions • Complete DSA • Interview Prep • Placement Guidance
          </span>

          {/* Vertical Divider */}
          <span className="hidden sm:inline text-slate-600">|</span>

          {/* Live Countdown Clock (takeUforward Zenkai Style) */}
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-blue-300 bg-blue-900/40 border border-blue-500/30 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="text-slate-400">Offer ends in</span>
            <span className="font-bold text-white tracking-wider">
              {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
            </span>
          </div>

          {/* Claim Button */}
          <Link
            href="/pro"
            className="group inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[11px] hover:from-amber-400 hover:to-orange-400 shadow-sm shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Claim Access</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss banner"
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
