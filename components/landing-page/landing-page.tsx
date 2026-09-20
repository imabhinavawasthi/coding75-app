"use client";

import React from "react";
import Footer from "../footer";
import { AnnouncementBanner } from "./announcement-banner";
import { LandingNavbar } from "./landing-navbar";
import { HeroSection } from "./hero-section";
import { SocialProof } from "./social-proof";
import { FeaturesBento } from "./features-bento";
import { SheetsShowcase } from "./sheets-showcase";
import { ProHighlightBanner } from "./pro-highlight-banner";
import { LandingTestimonials } from "./landing-testimonials";
import { LandingFAQ } from "./landing-faq";
import { FinalCta } from "./final-cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-400">
      {/* 1. Top Real-Time Countdown Sales Ticker (takeUforward Zenkai Banner Benchmark) */}
      <AnnouncementBanner />

      {/* 2. Sticky Glassmorphic Navbar with Mega Menus & Auth Integration */}
      <LandingNavbar />

      <main className="space-y-4">
        {/* 3. Hero Section with 5-Tab Interactive Cockpit (Sheets, POTD, Video, ATS, CS) */}
        <HeroSection />

        {/* 4. Social Proof & Floating Reach Cards (YouTube, Submissions, Placement Marquee) */}
        <SocialProof />

        {/* 5. "One Platform. Every Placement Advantage." 6-Pillar Platform Bento Grid */}
        <FeaturesBento />

        {/* 6. Curated Sheets Interactive Browser (SDE Sheet 180, Blind 75, Love Babbar 450) */}
        <SheetsShowcase />

        {/* 7. coding75 Pro Spotlight Banner (< ₹10/day, Live Classes & Doubts by Abhinav) */}
        <ProHighlightBanner />

        {/* 8. Verified Student Placement Wins (Microsoft, ServiceNow, GFG, Juspay, etc.) */}
        <LandingTestimonials />

        {/* 9. TUF-Style Interactive Frequently Asked Questions (FAQ) Accordion */}
        <LandingFAQ />

        {/* 10. Final High-Impact CTA Banner */}
        <FinalCta />
      </main>

      {/* 11. Global Footer */}
      <Footer />
    </div>
  );
}
