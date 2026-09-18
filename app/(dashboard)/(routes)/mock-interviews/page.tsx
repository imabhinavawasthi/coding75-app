"use client";

import ComingSoon from "@/components/coming-soon";
import { UserCheck, Video, FileCheck, Target, ShieldCheck } from "lucide-react";

export default function MockInterviewsPage() {
  return (
    <ComingSoon
      title="1:1 Mock Technical Interviews"
      subtitle="Simulate Real FAANG & Unicorn Technical Coding Rounds"
      description="Practice 1:1 live technical interviews in a simulated real-world whiteboard and collaborative coding environment with experienced senior software engineers from top tech companies."
      badge="Platform In Development"
      badgeColor="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
      icon={UserCheck}
      iconColor="text-purple-600 dark:text-purple-400"
      iconBg="bg-purple-500/15 border-purple-500/25"
      eta="Cohort Beta Coming Soon"
      features={[
        {
          title: "Real Collaborative IDE & Video",
          description: "Hands-on timed problem solving with live shared code editor, test execution, and realistic interview pressure.",
          icon: Video,
        },
        {
          title: "Structured 5-Pillar Rubric",
          description: "Actionable written feedback on Problem Solving, Code Structure, Edge Cases, Complexity Analysis, and Behavioral Communication.",
          icon: FileCheck,
        },
        {
          title: "Company-Targeted Tracks",
          description: "Mock sessions customized for Google, Amazon, Microsoft, and high-frequency startup interview patterns.",
          icon: Target,
        },
      ]}
    />
  );
}

