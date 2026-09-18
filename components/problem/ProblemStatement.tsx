"use client";

import React, { useState } from "react";
import { ExternalLink, ChevronDown, Lightbulb, Tag, Building2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatTag, slugify } from "@/utils/string";
import DifficultyBadge from "./DifficultyBadge";
import TagPill from "./TagPill";

export interface ProblemStatementData {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  platform?: string;
  problemUrl?: string;
  description?: string;
  companyTags?: string[];
  topicTags?: string[];
  hints?: string[];
  sheetTitle?: string;
  topicTitle?: string;
}

interface ProblemStatementProps {
  problem: ProblemStatementData;
  slug: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function SectionHeader({ icon, label, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
        {icon}
        <span className="text-[10px] font-extrabold uppercase tracking-widest">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
          {count}
        </span>
      )}
    </div>
  );
}

interface HintCardProps {
  hint: string;
  index: number;
  hintKey: string;
}

function HintCard({ hint, index, hintKey }: HintCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-xs">
      <button
        id={hintKey}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors text-left cursor-pointer"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-extrabold border border-amber-200 dark:border-amber-500/20 shrink-0">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Hint {index + 1}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3.5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
              <div className="flex gap-2.5">
                <Lightbulb
                  size={14}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {hint}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ProblemStatement ─────────────────────────────────────────────────────────

export const ProblemStatement: React.FC<ProblemStatementProps> = ({ problem, slug }) => {
  const [statementOpen, setStatementOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  const hasTopicTags = (problem.topicTags?.length ?? 0) > 0;
  const hasCompanyTags = (problem.companyTags?.length ?? 0) > 0;
  const hasHints = (problem.hints?.length ?? 0) > 0;

  return (
    <div className="w-full space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} size="md" />
          {problem.platform && (
            <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {problem.platform}
            </span>
          )}
          {problem.sheetTitle && (
            <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary-500/20 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              {problem.sheetTitle}
            </span>
          )}
          {problem.topicTitle && (
            <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border border-violet-500/20 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 uppercase tracking-wide">
              {problem.topicTitle}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
          {problem.title}
        </h2>

        {/* Solve button (Full Width & Clean Solid Sizing) */}
        {problem.problemUrl && (
          <div className="pt-2 w-full">
            <a
              href={problem.problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-[0.98] transition-all duration-200 cursor-pointer w-full shadow-sm"
            >
              <span>Solve on {problem.platform || "LeetCode"}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 dark:border-gray-800" />

      {/* Disclaimer Section */}
      <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 rounded-2xl p-4 text-xs font-semibold text-amber-800 dark:text-amber-300/80 leading-relaxed shadow-xs flex items-start gap-3 select-none">
        <p>
          CrackDSA does not claim ownership of this coding problem. We have just segregated these problems in our DSA sheets to help students solve in a structured manner.
        </p>
      </div>

      {/* ── Problem Statement Accordion ─────────────────────────────────── */}
      {problem.description && (
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-xs">
          <button
            onClick={() => setStatementOpen(!statementOpen)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-900/60 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors text-left cursor-pointer"
            aria-expanded={statementOpen}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-500/20 shrink-0">
                <FileText size={16} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                Show Problem Statement
              </span>
            </div>
            <motion.div animate={{ rotate: statementOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} className="text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {statementOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 py-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40">
                  <div
                    className="problem-description text-sm sm:text-[14px] text-gray-700 dark:text-gray-300 leading-7 prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: problem.description }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Topics & Companies Accordion ────────────────────────────────── */}
      {(hasTopicTags || hasCompanyTags) && (
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-xs">
          <button
            onClick={() => setTagsOpen(!tagsOpen)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-900/60 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors text-left cursor-pointer"
            aria-expanded={tagsOpen}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-500/20 shrink-0">
                <Tag size={16} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                Show Topics & Companies
              </span>
            </div>
            <motion.div animate={{ rotate: tagsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} className="text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {tagsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 py-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 space-y-5">
                  {/* Topic Tags */}
                  {hasTopicTags && (
                    <div>
                      <SectionHeader
                        icon={<Tag size={12} />}
                        label="Topics"
                        count={problem.topicTags!.length}
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {problem.topicTags!.map((tag) => (
                          <TagPill
                            key={tag}
                            label={formatTag(tag)}
                            variant="topic"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Company Tags */}
                  {hasCompanyTags && (
                    <div>
                      <SectionHeader
                        icon={<Building2 size={12} />}
                        label="Companies"
                        count={problem.companyTags!.length}
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {problem.companyTags!.map((tag) => (
                          <TagPill
                            key={tag}
                            label={formatTag(tag)}
                            variant="company"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Hints ───────────────────────────────────────────────────────────── */}
      {hasHints && (
        <div className="space-y-3">
          <SectionHeader
            icon={<Lightbulb size={12} />}
            label="Hints"
            count={problem.hints!.length}
          />
          <div className="space-y-2">
            {problem.hints!.map((hint, index) => (
              <HintCard
                key={index}
                hint={hint}
                index={index}
                hintKey={`hint-${slug}-${index}`}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProblemStatement;
