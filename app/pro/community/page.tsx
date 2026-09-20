"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  MessageCircle,
  Send,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useProStatus } from "@/hooks/use-pro-status";
import { ProRequiredModal } from "@/components/pro/pro-required-modal";
import { whatsapp_link, telegram_link } from "@/components/social-links";
import { Card, CardContent } from "@/components/ui/card";

export default function ProCommunityPage() {
  const { isPro, isLoading: loading } = useProStatus();
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Connecting to Pro Community...</p>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md border border-amber-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl font-black text-foreground">Pro Community Locked</h1>
          <p className="text-sm text-muted-foreground">
            The coding75 Pro Community is an exclusive network of top engineers, competitive programmers, and mentors.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/pro/checkout?plan=yearly"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm shadow-xl shadow-amber-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Join Pro Community</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProRequiredModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    );
  }

  const channels = [
    {
      title: "VIP WhatsApp Batch Group",
      description: "Direct updates for live sessions, doubt desks, assignment submissions, and quick announcements.",
      actionText: "Join WhatsApp Group",
      href: whatsapp_link,
      accent: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
      icon: MessageCircle,
    },
    {
      title: "Pro Telegram Discussion Hub",
      description: "Daily contest discussions, problem editorial breakdowns, peer code reviews, and off-campus referrals.",
      actionText: "Join Telegram Channel",
      href: telegram_link,
      accent: "border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400",
      icon: Send,
    },
    {
      title: "1:1 Mentor Query Desk",
      description: "Ask your roadmap or preparation questions directly to Abhinav and guest mentors.",
      actionText: "Message Mentors",
      href: whatsapp_link,
      accent: "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400",
      icon: Users,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pro Member Network</span>
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          coding75 Pro Community
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Welcome to the exclusive community. Connect with peer learners, ask doubts to mentors, and discover off-campus referrals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <a
              key={channel.title}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Card className="h-full border-border/80 hover:border-amber-500/40 hover:shadow-md transition-all group bg-card">
                <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${channel.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>{channel.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {channel.description}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform pt-2">
                    <span>{channel.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
