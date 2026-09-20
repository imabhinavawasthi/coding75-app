"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Crown,
  Calendar,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ExternalLink,
  Loader2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchUserSubscription, fetchUserTransactions } from "@/lib/checkout";
import { whatsapp_link } from "@/components/social-links";
import supabase from "@/supabase";
import { toast } from "sonner";

function ProfileSubscriptionContent() {
  const searchParams = useSearchParams();
  const justSubscribed = searchParams.get("status") === "success";

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  async function loadData() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }

      const [subRes, txRes] = await Promise.all([
        fetchUserSubscription(),
        fetchUserTransactions(),
      ]);

      setSubscriptionData(subRes);
      setTransactions(txRes.items || []);
    } catch (err) {
      console.error("Failed to load subscription data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    if (justSubscribed) {
      toast.success("Congratulations! Your coding75 Pro pass is now active 🎉");
    }
  }, [justSubscribed]);

  const isPro = subscriptionData?.is_pro_active || false;
  const proSub = subscriptionData?.pro_subscription || {};
  const expiryEpoch = proSub?.subscription_active_till_epoch;
  const allPurchases: any[] = proSub?.all_purchases || [];

  const proBenefits = [
    "Complete DSA Master Course & 150+ Video Lectures",
    "Weekly Live DSA Problem-Solving Interactive Classes",
    "Weekly Live 1:1 Doubt Clearing with Lead Mentors",
    "High-Yield CS Fundamentals Revision Notes (OS, DBMS, Networks)",
    "System Design Interview Notes (LLD & HLD)",
    "Full Access to all Competitive Programming Roadmaps & Ladders",
    "VIP Pro Community & Daily Curated Tech Opportunities",
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 select-none">
      {/* ── Back to Profile Link ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          className="rounded-xl text-xs font-bold gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Status</span>
        </Button>
      </div>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Subscription &amp; Access
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your coding75 Pro membership, track validity timelines, and view billing receipts.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-semibold text-muted-foreground">
            Loading your subscription details...
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ── Active Tier Overview Card ────────────────────────────────── */}
          <div
            className={`relative overflow-hidden rounded-3xl border-2 p-6 sm:p-8 space-y-6 shadow-xl transition-all ${
              isPro
                ? "border-blue-500/40 bg-gradient-to-br from-card via-card to-blue-500/10"
                : "border-border/80 bg-card"
            }`}
          >
            {isPro && (
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">
                  Current Membership Tier
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                    {isPro ? "coding75 Pro Member" : "Free Explorer"}
                  </h2>
                  {isPro ? (
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider px-3 py-1">
                      <Crown className="w-3.5 h-3.5 mr-1 text-amber-300" />
                      Active Pass
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs font-semibold">
                      Standard
                    </Badge>
                  )}
                </div>
              </div>

              {isPro ? (
                <div className="text-left sm:text-right space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block flex sm:justify-end items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Validity &amp; Expiration</span>
                  </span>
                  <p className="text-base sm:text-lg font-black text-foreground font-mono">
                    {expiryEpoch === -1
                      ? "👑 Lifetime Access"
                      : expiryEpoch
                      ? new Date(expiryEpoch * 1000).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Active"}
                  </p>
                </div>
              ) : (
                <Button
                  asChild
                  className="rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl cursor-pointer"
                >
                  <Link href="/pro/checkout?plan=yearly">
                    <Zap className="w-4 h-4 mr-1 text-amber-300" />
                    <span>Upgrade to Pro Pass</span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Pro Purchase Timeline History */}
            {allPurchases.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
                  Subscription Activation History:
                </span>
                <div className="space-y-2">
                  {allPurchases.map((hist, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-border/80 bg-muted/30 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground capitalize">
                          {hist.plan_name || hist.plan} Pass
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          Activated: {new Date(hist.purchase_date_epoch * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {hist.duration_in_days === -1 ? "Permanent Lifetime" : `+${hist.duration_in_days} Days`}
                        </span>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          TX: {hist.transaction_id ? `${hist.transaction_id.slice(0, 8)}...` : "Completed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Included Pro Benefits Checklist ──────────────────────────── */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Included Placement Privileges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {proBenefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-border/60 bg-muted/20 flex items-start gap-2.5"
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isPro ? "text-emerald-500" : "text-muted-foreground"
                    }`}
                  />
                  <span className={isPro ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Transactions & Billing Audit Table ────────────────────────── */}
          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm space-y-4">
            <div className="p-6 pb-2 flex items-center justify-between border-b border-border/60">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>Billing &amp; Transaction History</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Audit log of all payment orders and receipts associated with your account.
                </p>
              </div>

              <a
                href={whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Need Billing Support?</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>

            {transactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
                <Clock className="w-8 h-8 mx-auto text-muted-foreground/50" />
                <p>No transactions found on this account.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-foreground">
                            {tx.metadata?.target_name || tx.target_id || "Pro Subscription"}
                          </p>
                          <p className="text-[10px] text-muted-foreground capitalize">
                            {tx.purchase_type?.replace("_", " ")}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-foreground">
                          ₹{Number(tx.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          {tx.status === "success" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Success</span>
                            </span>
                          ) : tx.status === "pending" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/20">
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[11px] border border-rose-500/20">
                              <XCircle className="w-3 h-3" />
                              <span>Failed</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-muted-foreground text-[11px]">
                          {tx.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfileSubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-semibold text-muted-foreground">Loading subscription...</p>
          </div>
        </div>
      }
    >
      <ProfileSubscriptionContent />
    </Suspense>
  );
}
