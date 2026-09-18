"use client";

import ComingSoon from "@/components/coming-soon";
import { MessageSquare, Building2, DollarSign, Award, HelpCircle } from "lucide-react";

export default function InterviewExperiencesPage() {
  return (
    <ComingSoon
      title="Interview Experiences"
      subtitle="Real Technical Rounds, Questions & Compensation Debriefs"
      description="Read verified, firsthand interview experiences from candidates who cleared technical rounds at Google, Amazon, Microsoft, Uber, Atlassian, and high-growth tech unicorns."
      badge="Curating Verified Submissions"
      badgeColor="bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30"
      icon={MessageSquare}
      iconColor="text-orange-600 dark:text-orange-400"
      iconBg="bg-orange-500/15 border-orange-500/25"
      eta="Launching Soon"
      features={[
        {
          title: "Round-by-Round Breakdowns",
          description: "Full debriefs covering Online Assessments, live DSA coding rounds, Low-Level & High-Level System Design, and Behavioral rounds.",
          icon: HelpCircle,
        },
        {
          title: "Top Tier-1 Company Debriefs",
          description: "Curated experiences from Google, Amazon, Microsoft, Meta, Uber, Swiggy, and top fintech/AI startups.",
          icon: Building2,
        },
        {
          title: "Verified Compensation & Offers",
          description: "Transparent salary, stock grant, and bonus breakdowns to help you negotiate top-of-band offers.",
          icon: DollarSign,
        },
      ]}
    />
  );
}

