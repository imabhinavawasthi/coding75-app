"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Video,
  Users,
  Layers,
} from "lucide-react";

export interface ProRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  featureName?: string;
}

export function ProRequiredModal({
  isOpen,
  onClose,
  title = "Unlock coding75 Pro Access",
  description = "This lecture and exclusive resources are available to coding75 Pro members. Upgrade today to unlock complete curriculum access.",
  featureName = "coding75 Pro Exclusive",
}: ProRequiredModalProps) {
  const router = useRouter();

  const handleGoToCheckout = () => {
    onClose();
    router.push("/pro/checkout?plan=yearly");
  };

  const handleExplorePlans = () => {
    onClose();
    router.push("/pro#pricing");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-card shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="space-y-3.5 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <Badge
              variant="outline"
              className="text-[11px] font-extrabold px-3 py-0.5 rounded-full border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400"
            >
              {featureName}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Benefits Checklist Box */}
        <div className="space-y-2.5 py-3 my-2 bg-muted/40 rounded-2xl p-4 border border-border/70 text-xs">
          <div className="flex items-center gap-2.5 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>150+ In-Depth DSA Videos</strong> with whiteboard conceptual breakdowns</span>
          </div>
          <div className="flex items-center gap-2.5 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>Weekly Live Classes & Doubt Solving</strong> directly with Lead Mentors</span>
          </div>
          <div className="flex items-center gap-2.5 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>Complete 2-Year Preparation Pass</strong> for just ₹8/day</span>
          </div>
          <div className="flex items-center gap-2.5 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>Full Access</strong> to DSA Topic Tree, Sheets & System Design</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleGoToCheckout}
            className="w-full h-11 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 transition-all gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get 2-Year Pro Pass (Best Value)</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExplorePlans}
              className="flex-1 h-9 rounded-xl font-bold text-xs border-border hover:bg-muted text-foreground cursor-pointer"
            >
              View All Plans
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-9 rounded-xl font-medium text-xs text-muted-foreground hover:text-foreground cursor-pointer px-4"
            >
              Maybe Later
            </Button>
          </div>
        </div>

        {/* Security / Guarantee Footer */}
        <div className="pt-2 text-center flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Instant Access • Trusted by 10,000+ Students</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
