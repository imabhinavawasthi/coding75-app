"use client";

import React from "react";
import Image from "next/image";
import {
  Award,
  ExternalLink,
  Linkedin,
  Sparkles,
  Trophy,
  Users,
  CheckCircle2,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRO_MENTORS, MentorProfile } from "../_config/pro-config";
import { PRO_LOGOS } from "../_config/pro-logos";

// Picture imports
import abhinavPic from "../../../public/pictures/abhinav.jpeg";
import harshitPic from "../../../public/pictures/harshit.png";
import abhayPic from "../../../public/pictures/abhay.jpeg";
import surajPic from "../../../public/pictures/suraj.jpeg";
import jwalaPic from "../../../public/pictures/jwala.jpeg";
import yashPandeyPic from "../../../public/pictures/yash-pandey.jpeg";

const MENTOR_IMAGES: Record<string, any> = {
  "Abhinav Awasthi": abhinavPic,
  "Harshit Varshney": harshitPic,
  "Abhay Ray": abhayPic,
  "Suraj Gaud": surajPic,
  "Jwala Chorasiya": jwalaPic,
  "Yash Pandey": yashPandeyPic,
};

export function ProMentorSpotlight() {
  const leadMentor = PRO_MENTORS.find((m) => m.isLead) || PRO_MENTORS[0];
  const coMentors = PRO_MENTORS.filter((m) => !m.isLead);

  return (
    <section id="mentors" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Section Header (Preserving user deletion of eyebrow badge) */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Learn From{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Top Engineers
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Taught directly by engineers who have cracked Tier-1 tech interviews, ICPC Regionals, and work at leading engineering organizations.
        </p>
      </div>

      {/* ── Spotlight Hero Card: Abhinav Awasthi (Lead Mentor) ──────────────── */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-blue-500/40 bg-gradient-to-br from-card via-card to-blue-500/5 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Mentor Photo & Credentials */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-blue-500/30 shadow-2xl relative">
                <Image
                  src={MENTOR_IMAGES[leadMentor.name]}
                  alt={leadMentor.name}
                  fill
                  sizes="192px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                {leadMentor.name}
              </h3>
              <p className="text-sm font-semibold text-primary">
                SDE 2 @ Zeta • Former SDE @ LinkedIn
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Users className="w-3.5 h-3.5" />
                <span>{leadMentor.mentoredCount}</span>
              </div>
            </div>

            {/* Social CTAs: LinkedIn (50k+) & YouTube (20k+) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl font-bold text-xs gap-2 border-blue-500/30 text-blue-600 hover:bg-blue-500/10 cursor-pointer"
              >
                <a href={leadMentor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 text-[#0077B5]" />
                  <span>50k+ Followers</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                </a>
              </Button>
              {leadMentor.youtubeUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl font-bold text-xs gap-2 border-red-500/30 text-red-600 hover:bg-red-500/10 cursor-pointer"
                >
                  <a href={leadMentor.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4 text-[#FF0000]" />
                    <span>20k+ Subscribers</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Mentor Highlights & Bio */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Lead Mentor Accolades & Pedigree</span>
              </span>
              <p className="text-sm sm:text-base text-foreground leading-relaxed">
                Abhinav personally architected and recorded the complete DSA master lectures. SDE 2 at Zeta and Former SDE at LinkedIn, he has cracked interviews of top tech companies including Amazon, Zomato, Zscaler, and Gameskraft, and mentored 5,000+ engineers personally.
              </p>
            </div>

            {/* Accolades checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {leadMentor.credentials.map((cred, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-border/80 bg-muted/30 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-semibold text-foreground">{cred}</span>
                </div>
              ))}
            </div>

            {/* Organizations: 1. Cracked Offers & Top Companies */}
            {leadMentor.crackedLogos && (
              <div className="pt-3 border-t border-border/60 space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Cracked Offers & Top Companies:
                </span>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 opacity-85 grayscale hover:grayscale-0 transition-all duration-300">
                  {leadMentor.crackedLogos.map((logo) => (
                    <img
                      key={logo.name}
                      src={logo.logoUrl}
                      alt={logo.name}
                      title={logo.name}
                      className={`${logo.heightClass || "h-5 sm:h-6"} w-auto object-contain ${logo.themeClass || ""}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Organizations: 2. Taught At & Competitive Programming Platforms */}
            {leadMentor.teachingLogos && (
              <div className="pt-2 border-t border-border/60 space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Taught At & Competitive Programming Platforms:
                </span>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 opacity-85 grayscale hover:grayscale-0 transition-all duration-300">
                  {leadMentor.teachingLogos.map((logo) => (
                    <img
                      key={logo.name}
                      src={logo.logoUrl}
                      alt={logo.name}
                      title={logo.name}
                      className={`${logo.heightClass || "h-5 sm:h-6"} w-auto object-contain ${logo.themeClass || ""}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Co-Mentors Grid ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            Other Mentors & Instructors
          </h3>
          <p className="text-xs text-muted-foreground">
            Get your questions resolved by engineers working across Microsoft, Amazon, Zomato, Induced AI, Agoda, and J.P. Morgan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coMentors.map((mentor: MentorProfile) => (
            <div
              key={mentor.name}
              className="rounded-3xl border border-blue-500/20 bg-gradient-to-b from-card via-card to-blue-500/5 p-5 space-y-4 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-lg transition-all shadow-sm group"
            >
              <div className="space-y-3">
                {/* Photo & Company / Associated logos */}
                <div className="flex items-start justify-between gap-2">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-border shadow-md shrink-0">
                    <Image
                      src={MENTOR_IMAGES[mentor.name]}
                      alt={mentor.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Associated Logos list */}
                  <div className="flex flex-wrap items-center justify-end gap-2.5 max-w-[140px] opacity-80 group-hover:opacity-100 transition-opacity">
                    {mentor.associatedLogos && mentor.associatedLogos.length > 0 ? (
                      mentor.associatedLogos.map((logo) => (
                        <React.Fragment key={logo.name}>
                          {logo.logoDarkUrl ? (
                            <>
                              <img
                                src={logo.logoUrl}
                                alt={logo.name}
                                title={logo.name}
                                className={`${logo.heightClass || "h-5"} max-w-[70px] object-contain ${logo.themeClass || ""} dark:hidden`}
                              />
                              <img
                                src={logo.logoDarkUrl}
                                alt={logo.name}
                                title={logo.name}
                                className={`${logo.heightClass || "h-5"} max-w-[70px] object-contain ${logo.themeClass || ""} hidden dark:inline-block`}
                              />
                            </>
                          ) : (
                            <img
                              src={logo.logoUrl}
                              alt={logo.name}
                              title={logo.name}
                              className={`${logo.heightClass || "h-5"} max-w-[70px] object-contain ${logo.themeClass || ""}`}
                            />
                          )}
                        </React.Fragment>
                      ))
                    ) : mentor.companyLogoUrl ? (
                      <img
                        src={mentor.companyLogoUrl}
                        alt={mentor.company}
                        className={`h-5 max-w-[80px] object-contain ${mentor.companyLogoThemeClass || ""}`}
                      />
                    ) : null}
                  </div>
                </div>

                {/* Name & Role */}
                <div className="space-y-0.5">
                  <h4 className="font-bold text-base text-foreground">{mentor.name}</h4>
                  <p className="text-xs font-semibold text-primary">
                    {mentor.role} @ {mentor.company}
                  </p>
                  {mentor.formerCompany && (
                    <p className="text-[11px] text-muted-foreground">
                      Former @ {mentor.formerCompany}
                    </p>
                  )}
                </div>

                {/* Mentorship stats */}
                <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                  <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{mentor.mentoredCount}</span>
                </div>

                {/* Experience snippet */}
                <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/60">
                  {mentor.experienceSummary}
                </p>
              </div>

              {/* LinkedIn link */}
              <div className="pt-3 border-t border-border/60">
                <a
                  href={mentor.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
