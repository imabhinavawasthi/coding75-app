"use client";

import ComingSoon from "@/components/coming-soon";
import { Sparkles, GitBranch, Layers, Cpu, Zap, Network } from "lucide-react";

export default function MasterclassesPage() {
  return (
    <ComingSoon
      title="Advanced Algorithmic Masterclasses"
      subtitle="Intensive Live Cohorts for Advanced DSA & Competitive Programming"
      description="Deep-dive live masterclasses and cohort-based training covering advanced dynamic programming, complex tree algorithms, range query data structures, and maximum network flow led by candidate masters and FAANG engineers."
      badge="Cohorts In Preparation"
      badgeColor="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
      icon={Sparkles}
      iconColor="text-purple-600 dark:text-purple-400"
      iconBg="bg-purple-500/15 border-purple-500/25"
      eta="Upcoming Cohort 2026"
      features={[
        {
          title: "DP & Tree Rerooting Masterclass",
          description: "Digit DP, Bitmask DP, Tree Rerooting, SOS DP, and DSU on Trees with hard contest and interview problem walkthroughs.",
          icon: Zap,
        },
        {
          title: "Segment Trees & Range Queries",
          description: "Segment Trees with Lazy Propagation, Merge Sort Trees, Persistent Data Structures, Fenwick Trees, and Mo's Algorithm.",
          icon: Layers,
        },
        {
          title: "Advanced Graphs & Network Flow",
          description: "Tarjan's Bridges/SCC, 2-SAT, Dinic's Max Flow, Minimum Cut, and bipartite matching applications.",
          icon: Network,
        },
      ]}
    />
  );
}
