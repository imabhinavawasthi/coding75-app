import React from "react";
import { Metadata } from "next";
import Footer from "@/components/footer";
import { ProNavbar } from "./_components/pro-navbar";
import { ProHero } from "./_components/pro-hero";
import { ProImpactBanner } from "./_components/pro-impact-banner";
import { ProFeaturesBento } from "./_components/pro-features-bento";
import { ProMentorSpotlight } from "./_components/pro-mentor-spotlight";
import { ProComparisonTable } from "./_components/pro-comparison-table";
import { ProPricingCards } from "./_components/pro-pricing-cards";
import { ProTestimonials } from "./_components/pro-testimonials";
import { ProFaq } from "./_components/pro-faq";
import { ProSupportCta } from "./_components/pro-support-cta";

export const metadata: Metadata = {
  title: "coding75 pro",
  description:
    "All-in-one tech placement pass: Complete DSA course & video lectures, weekly live interactive classes, doubt resolution, CS Fundamentals, and curated tech opportunities for less than ₹10/day.",
};

export default function ProPage() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-400">
      {/* Sticky Navigation with User Profile Dropdown & Premium Pro CTA */}
      <ProNavbar />

      <main className="space-y-6">
        {/* 1. Hero Header Section with Blue Theme & coding75 Pro */}
        <ProHero />

        {/* 2. Reviews & Verified Student Wins Placed Right After Hero */}
        <ProTestimonials />

        {/* 3. "Everything in One Pass" Core Pillars Bento Grid */}
        <ProFeaturesBento />

        {/* 4. Lead Mentor Spotlight (Abhinav Awasthi) + Specialist Mentors */}
        <ProMentorSpotlight />

        {/* 5. Exhaustive Comparison Table vs Others */}
        <ProComparisonTable />

        {/* 6. Daily Impact Banner (< ₹10/day) Placed Immediately Above Pricing */}
        <ProImpactBanner />

        {/* 7. Configurable 3-Tier Pricing Cards with Strict Alignment */}
        <ProPricingCards />

        {/* 8. Frequently Asked Questions */}
        <ProFaq />

        {/* 9. Multi-Channel Support & Final CTA */}
        <ProSupportCta />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}