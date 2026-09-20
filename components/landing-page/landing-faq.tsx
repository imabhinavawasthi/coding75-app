"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Sparkles, ArrowRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQS: FAQItem[] = [
  {
    category: "General",
    question: "Is the basic coding75 platform and DSA sheets free to use?",
    answer:
      "Yes, 100% free forever! You can practice all curated problem sheets (including SDE Placement Sheet 180, Blind 75, pattern-wise question ladders), track your progress interactively, build your ATS LaTeX resume, and view daily LeetCode POTD contest editorials completely free of charge.",
  },
  {
    category: "Pro Membership",
    question: "What extra features and mentorship do I get with coding75 Pro?",
    answer:
      "coding75 Pro is our comprehensive mentorship & placement accelerator. Pro members unlock: 150+ in-depth DSA video master lectures recorded by Abhinav Awasthi (ex-LinkedIn, Zeta), weekly live weekend problem-solving classes, weekly live 1:1 doubt clearing sessions with top mentors, interview-ready CS Fundamentals notes (Operating Systems, DBMS, Computer Networks, System Design LLD & HLD), full competitive programming contest upsolving catalogs, and curated off-campus job opportunity alerts.",
  },
  {
    category: "Classes & Schedule",
    question: "When are the weekly live classes and doubt clearing sessions held?",
    answer:
      "Live interactive classes and doubt resolution sessions are scheduled every weekend and select weekday evenings (typically 8:00 PM IST onwards). This ensures college students and working software professionals can attend live without disrupting their classes or work commitments.",
  },
  {
    category: "Classes & Schedule",
    question: "What happens if I miss a live class or have upcoming college semester exams?",
    answer:
      "Never worry about missed sessions! Every live class is recorded in 1080p HD and uploaded directly to your Pro student dashboard within hours. You receive complete whiteboard notes, source code in C++/Python/Java, and relevant practice problems with uninterrupted access throughout your subscription.",
  },
  {
    category: "Prerequisites",
    question: "I am a complete beginner or from a non-CS branch. Is coding75 Pro suitable for me?",
    answer:
      "Absolutely. The curriculum is intentionally structured from scratch: starting with programming syntax, asymptotic time & space complexity, recursion, and foundational arrays/strings before transitioning step-by-step to advanced dynamic programming, graphs, segment trees, and system design.",
  },
  {
    category: "Pricing & Billing",
    question: "How does the Pro pricing work? Is it really less than ₹10/day?",
    answer:
      "Yes! Traditional coding bootcamps charge ₹50,000 to ₹1,50,000 with predatory income-share agreements. coding75 Pro is priced transparently from ₹799/month (~₹26/day) or ₹5,999 for 2 full years (~₹8/day) — less than ₹10 a day and cheaper than a cup of tea! There are zero hidden fees, zero loan lock-ins, and you can cancel renewal anytime with 1-click.",
  },
  {
    category: "Placements & Career",
    question: "How does the Curated Opportunities & Hiring Drops section work?",
    answer:
      "We monitor verified off-campus hiring drives, test links, and job openings across tier-1 product companies, fintechs, and high-growth tech startups. We do not make false referral promises; instead, we alert our community to legitimate open applications before they close, paired with company-specific interview preparation sheets.",
  },
  {
    category: "CP & Contests",
    question: "Can I prepare for both software engineering interviews and competitive programming?",
    answer:
      "Yes! While our interview track zeroes in on FAANG-style problem patterns and CS fundamentals, our CP track includes Codeforces Div. 2/3 contest editorials, LeetCode Weekly upsolving, rating improvement guides, and math/combinatorics tricks designed to push your Codeforces rating past 1600+ (Expert).",
  },
];

export function LandingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Got Questions?</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Frequently Asked{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Questions
          </span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Everything you need to know about our free problem sheets, daily contest editorials, and coding75 Pro live cohorts.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-blue-500/50 bg-blue-500/[0.03] shadow-md shadow-blue-500/5"
                  : "border-border/80 bg-card hover:border-blue-500/30"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground">
                    {faq.question}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-transform duration-200 shrink-0 ${
                    isOpen
                      ? "rotate-180 bg-blue-600 border-blue-600 text-white"
                      : "border-border/80 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1 pl-14">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Footer Card */}
      <div className="p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="font-bold text-sm text-foreground">Have more specific questions?</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Check out our detailed coding75 Pro page to see all cohort features, schedule, and pricing.
          </p>
        </div>

        <Link
          href="/pro"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore coding75 Pro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
