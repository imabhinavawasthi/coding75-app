"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { PRO_FAQS, FaqItem } from "../_config/pro-config";
import { whatsapp_link } from "@/components/social-links";

export function ProFaq() {
  return (
    <section id="faqs" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header with Blue Theme */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-bold uppercase tracking-wider px-3 py-1 border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
        >
          Got Questions?
        </Badge>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Frequently Asked{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Questions
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Everything you need to know about coding75 Pro, live classes, doubt support, and membership benefits.
        </p>
      </div>

      {/* Accordion List with Blue Theme */}
      <div className="rounded-3xl border border-blue-500/20 bg-card p-4 sm:p-8 shadow-md">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {PRO_FAQS.map((faq: FaqItem, idx: number) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-border/60 rounded-2xl px-4 sm:px-5 data-[state=open]:bg-blue-500/5 data-[state=open]:border-blue-500/30 transition-colors"
            >
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base text-foreground hover:text-blue-600 dark:hover:text-blue-400 py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4 pt-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Still Have Questions CTA */}
      <div className="text-center space-y-3 pt-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Still have a specific question about your situation or batch timings?
        </p>
        <a
          href={whatsapp_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Ask Mentors Directly on WhatsApp</span>
        </a>
      </div>
    </section>
  );
}
