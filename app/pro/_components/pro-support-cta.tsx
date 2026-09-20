"use client";

import React from "react";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  Mail,
  Sparkles,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsapp_link, telegram_link } from "@/components/social-links";

export function ProSupportCta() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Contact & Support Grid with Blue Theme */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 p-6 sm:p-10 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/60">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase">
              <Headphones className="w-3.5 h-3.5" />
              <span>Dedicated Learner Support</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              We&apos;re Here to Help You Succeed
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Have doubts regarding syllabus coverage, live class schedules, or your current prep level? Connect directly with our team before or after joining.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Support Online • Fast Response</span>
          </div>
        </div>

        {/* 3 Support Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* WhatsApp Direct */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">WhatsApp Instant Chat</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Chat 1:1 with a mentor to get curriculum advice, batch timing details, or enrollment help.
              </p>
            </div>

            <Button
              asChild
              size="sm"
              className="w-full rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer gap-1.5"
            >
              <a href={whatsapp_link} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </Button>
          </div>

          {/* Telegram Channel */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Telegram Community</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Join our 25K+ community for daily problem discussions, off-campus opportunity drops, and study circles.
              </p>
            </div>

            <Button
              asChild
              size="sm"
              className="w-full rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer gap-1.5"
            >
              <a href={telegram_link} target="_blank" rel="noopener noreferrer">
                <Send className="w-3.5 h-3.5" />
                <span>Join Telegram</span>
              </a>
            </Button>
          </div>

          {/* Email Support */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Official Email Support</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For corporate inquiries, campus batch partnerships, or detailed technical assistance.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full rounded-xl font-bold text-xs border-border/80 hover:bg-muted cursor-pointer gap-1.5"
            >
              <a href="mailto:support@coding75.com">
                <Mail className="w-3.5 h-3.5" />
                <span>support@coding75.com</span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Final Hero Banner with Blue/Indigo/Violet Theme */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accelerate Your Career Today</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
            Stop Overthinking. Start Prepping for Your Dream Tech Offer.
          </h3>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Get complete access to all DSA lectures, weekly live classes, doubt resolution, and curated tech opportunities for less than ₹10/day.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Button
            asChild
            size="lg"
            className="rounded-2xl font-extrabold text-sm h-12 px-7 bg-white text-blue-950 hover:bg-white/90 shadow-xl cursor-pointer"
          >
            <Link href="#pricing">
              <span>View All Pro Plans</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-2xl font-bold text-sm h-12 px-6 border-white/30 text-white bg-white/10 hover:bg-white/20 cursor-pointer"
          >
            <a href={whatsapp_link} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>Ask a Mentor</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
