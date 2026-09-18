import React from "react";
import Link from "next/link";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import {
  github_link,
  linkedin_link,
  telegram_link,
  whatsapp_link,
  youtube_link,
  feedback_form,
} from "./social-links";
import { Sparkles } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/70 bg-card/60 backdrop-blur-md text-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1 & 2: Brand, Mission & Social Links */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/dashboard" className="inline-block hover:opacity-85 transition-opacity">
              <Logo width={150} height={38} />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              The premier developer platform for mastering Data Structures & Algorithms, exploring contest editorials, building ATS-ready resumes, and accelerating your tech career.
            </p>

            {/* Social Media Links (Moved from Navbar to Footer) */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Connect & Community
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={github_link}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground hover:scale-105 transition-all shadow-2xs"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href={telegram_link}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-muted/80 hover:bg-muted text-muted-foreground hover:text-[#229ed9] hover:scale-105 transition-all shadow-2xs"
                  aria-label="Telegram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z"/>
                  </svg>
                </a>
                <a
                  href={youtube_link}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-muted/80 hover:bg-muted text-muted-foreground hover:text-[#f00] hover:scale-105 transition-all shadow-2xs"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href={linkedin_link}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-muted/80 hover:bg-muted text-muted-foreground hover:text-[#0a66c2] hover:scale-105 transition-all shadow-2xs"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href={whatsapp_link}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-muted/80 hover:bg-muted text-muted-foreground hover:text-[#25D366] hover:scale-105 transition-all shadow-2xs"
                  aria-label="WhatsApp Support"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: DSA & Contests */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              DSA & Contests
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dsa" className="text-muted-foreground hover:text-primary transition-colors">
                  Learn DSA
                </Link>
              </li>
              <li>
                <Link href="/contests" className="text-muted-foreground hover:text-primary transition-colors">
                  Contest Solutions
                </Link>
              </li>
              <li>
                <Link href="/contests/leetcode-potd" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>LeetCode POTD</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">Daily</span>
                </Link>
              </li>
              <li>
                <Link href="/dsa-cp/sheets" className="text-muted-foreground hover:text-primary transition-colors">
                  Practice Sheets
                </Link>
              </li>
              <li>
                <a href="/masterclasses" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>Masterclasses</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">Soon</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Interview Preparation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Interview Prep
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  Portfolio Projects
                </Link>
              </li>
              <li>
                <Link href="/cs-fundamentals" className="text-muted-foreground hover:text-primary transition-colors">
                  CS Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/system-design" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>System Design</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">Soon</span>
                </Link>
              </li>
              <li>
                <Link href="/interview-experiences" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>Interview Experiences</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">Soon</span>
                </Link>
              </li>
              <li>
                <Link href="/mock-interviews" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>Mock Interviews</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">Soon</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Career & Platform */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Career & Pro
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/opportunities" className="text-muted-foreground hover:text-primary transition-colors">
                  Jobs & Internships
                </Link>
              </li>
              <li>
                <Link href="/resume" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>Resume Builder</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">ATS</span>
                </Link>
              </li>
              <li>
                <Link href="/pro" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-semibold text-foreground">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>coding75 Pro</span>
                </Link>
              </li>
              <li>
                <Link href="/classroom" className="text-muted-foreground hover:text-primary transition-colors">
                  Live Cohort Classes
                </Link>
              </li>
              <li>
                <a href={feedback_form} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Submit Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-start">
            <span>© {currentYear}</span>
            <span className="font-bold text-foreground">coding75</span>
            <span>• Powered by</span>
            <a href="https://crackdsa.com" target="_blank" rel="noreferrer" className="font-semibold hover:text-foreground underline">
              crackDSA™
            </a>
            <span>. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <a href="https://crackdsa.com/privacy/" target="_blank" rel="noreferrer" className="hover:text-foreground underline">
              Privacy Policy
            </a>
            <a href="https://crackdsa.com/terms/" target="_blank" rel="noreferrer" className="hover:text-foreground underline">
              Terms & Conditions
            </a>
            <a href={whatsapp_link} target="_blank" rel="noreferrer" className="hover:text-foreground underline">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;