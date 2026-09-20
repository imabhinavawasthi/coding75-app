"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Tag,
  ArrowRight,
  Lock,
  Loader2,
  Zap,
  HelpCircle,
  X,
  Gift,
  Clock,
  ExternalLink,
  Star,
  Check,
  Shield,
  Award,
  Users,
  Video,
  Radio,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import { PRO_PRICING_CONFIG, getProPlanById, ProPricingTier } from "../_config/pro-pricing";
import { PRO_MENTORS, MentorProfile } from "../_config/pro-config";
import FancyTestimonialsSlider from "../_components/testimonials";
import {
  validateCoupon,
  createCheckoutOrder,
  verifyCheckoutPayment,
  loadRazorpaySDK,
} from "@/lib/checkout";
import { useLeaveIntent } from "@/hooks/use-leave-intent";
import supabase from "@/supabase";
import { toast } from "sonner";
import { whatsapp_link } from "@/components/social-links";

const CHECKOUT_TESTIMONIALS = [
      {
        img: "https://upload.wikimedia.org/wikipedia/commons/5/57/ServiceNow_logo.svg",
        quote: "I have attended the live DSA sessions and they are very useful. The concepts are explained thoroughly and doubts are resolved well, which helped me to get prepared for my placements and interviews.",
        name: 'Aditya Chaudhary',
        role: 'Intern at Service Now'
      },
      {
        img: "/logos/microsoft.svg",
        quote: "Live project building sessions helped me a lot to put some good projects in my resume, with good resume review and mock interviews sessions, I got selected in microsoft internship.",
        name: 'Jatin Pal',
        role: 'SWE Intern at Microsoft.'
      },
      {
        img: "https://www.paisabazaar.com/PBHP/assets/images/paisabazaar-logo.svg",
        quote: "I used to attend live classes of DSA and CS Fundamentals, which made my basics of DSA and CS very clear, and I got my first internship in my second year.",
        name: 'Aditya Pandey',
        role: 'Intern at paisabazaar.com'
      },
      {
        img: "https://upload.wikimedia.org/wikipedia/commons/1/1b/OpenText_logo.svg",
        quote: "Attending the DSA and C++ lectures has truly been a game-changer for me. The guidance and regular doubt-clearing sessions were invaluable, helping me breeze through coding challenges and interview rounds with confidence. ",
        name: 'Priyanshu Singh',
        role: 'Software Engineer Intern at OpenText'
      },
      {
        img: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png",
        quote: "I have attended the live DSA&CP sessions and they are very useful. All the concepts are explained thoroughly and doubts are resolved well. I was able to reach ACM ICPC Regionals and grab an SDE internship at GeeksForGeeks.",
        name: 'Ripan Roy',
        role: 'SDE Intern Offer from GFG'
      },
      {
        img: "https://imgee.s3.amazonaws.com/imgee/a0baca393d534736b152750c7bde97f1.png",
        quote: "I was struggling with DSA, but after joining regular DSA and CP classes, I started solving problems and worked on my problem solving skills, and I was able to clear coding round of Juspay..",
        name: 'Aman Verma',
        role: 'Intern at Juspay'
      }
    ];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPlanId = (searchParams.get("plan") as "monthly" | "yearly" | "lifetime") || "yearly";
  const initialCoupon = searchParams.get("coupon") || "";

  // Selected Plan state
  const [selectedPlanId, setSelectedPlanId] = useState<"monthly" | "yearly" | "lifetime">(initialPlanId);
  const plan: ProPricingTier = PRO_PRICING_CONFIG[selectedPlanId] || PRO_PRICING_CONFIG.yearly;

  // Selected lead mentors dynamically sourced from config (Abhinav, Jwala, Harshit)
  const leadMentors: MentorProfile[] = [
    PRO_MENTORS.find((m) => m.name.toLowerCase().includes("abhinav")),
    PRO_MENTORS.find((m) => m.name.toLowerCase().includes("jwala")),
    PRO_MENTORS.find((m) => m.name.toLowerCase().includes("harshit")),
  ].filter(Boolean) as MentorProfile[];

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState(initialCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    discount_amount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // User state
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Exit Intent state
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitModalDismissed, setExitModalDismissed] = useState(false);

  // 1. Initial User Session Check
  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setAuthLoading(false);
      }
    }
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Auto-apply coupon from URL if passed
  useEffect(() => {
    if (initialCoupon && !appliedCoupon) {
      handleApplyCoupon(initialCoupon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCoupon]);

  // Recalculate discount amount whenever plan or applied coupon changes
  const basePrice = plan.price;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "percentage") {
      discountAmount = Math.round((basePrice * appliedCoupon.discount_value) / 100);
    } else {
      discountAmount = appliedCoupon.discount_value;
    }
  }
  const finalPrice = Math.max(1, basePrice - discountAmount);

  // 3. Coupon Application Handler
  async function handleApplyCoupon(codeToApply?: string) {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await validateCoupon(code, "pro_subscription", selectedPlanId);

      if (res.valid && res.discount_value) {
        let calcDiscount = 0;
        if (res.discount_type === "percentage") {
          calcDiscount = Math.round((basePrice * res.discount_value) / 100);
        } else {
          calcDiscount = res.discount_value;
        }

        setAppliedCoupon({
          code: res.code,
          discount_type: res.discount_type,
          discount_value: res.discount_value,
          discount_amount: calcDiscount,
        });
        setCouponCodeInput(res.code);
        toast.success(`Coupon ${res.code} applied! Saved ₹${calcDiscount}`);
      } else {
        setCouponError(res.message || "Invalid coupon code");
        toast.error(res.message || "Invalid coupon code");
      }
    } catch (err: any) {
      const msg = err.message || "Failed to validate coupon";
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponError(null);
    toast.info("Coupon removed");
  }

  // 4. Exit Intent Hook Handler
  useLeaveIntent(() => {
    if (!exitModalDismissed && !appliedCoupon) {
      setShowExitModal(true);
    }
  });

  // 5. Payment Execution via Razorpay
  async function handleProceedToPayment() {
    if (!user) {
      toast.info("Please sign in to complete your purchase");
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "loggedin_route",
          `/pro/checkout?plan=${selectedPlanId}${appliedCoupon ? `&coupon=${appliedCoupon.code}` : ""}`
        );
      }
      try {
        const redirectUrl = `${window.location.origin}/login/callback`;
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
            queryParams: { prompt: "select_account" },
          },
        });
      } catch (err) {
        console.error("Login redirect error:", err);
      }
      return;
    }

    setIsProcessingPayment(true);

    try {
      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded && !(window as any).Razorpay) {
        throw new Error("Unable to load payment gateway SDK. Please check your connection.");
      }

      const orderData = await createCheckoutOrder(
        "pro_subscription",
        selectedPlanId,
        appliedCoupon?.code
      );

      const options = {
        key: orderData.razorpay_key_id,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency || "INR",
        name: "coding75 Pro",
        description: `${plan.name} - Complete DSA & Placement Pass`,
        image: "/logos/coding75.png",
        order_id: orderData.razorpay_order_id.startsWith("order_mock_")
          ? undefined
          : orderData.razorpay_order_id,
        handler: async function (response: any) {
          try {
            toast.loading("Verifying payment and activating your Pro access...", {
              id: "verify-payment",
            });

            await verifyCheckoutPayment({
              razorpay_order_id: response.razorpay_order_id || orderData.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              transaction_id: orderData.transaction_id,
            });

            toast.success("Payment successful! Welcome to coding75 Pro 🎉", {
              id: "verify-payment",
            });

            router.push(`/profile/subscription?status=success&plan=${selectedPlanId}`);
          } catch (verifyErr: any) {
            console.error("Payment verification failed:", verifyErr);
            toast.error(verifyErr.message || "Payment verification failed. Please contact support.", {
              id: "verify-payment",
            });
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
          email: user?.email || "",
        },
        notes: {
          plan_id: plan.id,
          transaction_id: orderData.transaction_id,
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            toast.info("Payment cancelled.");
          },
        },
      };

      if (orderData.razorpay_order_id.startsWith("order_mock_")) {
        const confirmMock = window.confirm(
          `[TEST MODE SIMULATION]\n\nRazorpay test order initialized for ₹${orderData.amount}.\nClick OK to simulate successful test payment, or Cancel to abort.`
        );
        if (confirmMock) {
          options.handler({
            razorpay_order_id: orderData.razorpay_order_id,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: "mock_test_signature",
          });
          return;
        } else {
          setIsProcessingPayment(false);
          return;
        }
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        toast.error(response.error.description || "Payment failed. Please try again.");
        setIsProcessingPayment(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Order creation failed:", err);
      toast.error(err.message || "Failed to initialize payment. Please try again.");
      setIsProcessingPayment(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background text-foreground selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-400">
      {/* ── Top Navigation Bar with High-Trust Security Indicators ────────── */}
      <header className="sticky top-0 z-30 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/pro"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Pro Overview</span>
            </Link>
          </div>

          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo width={120} height={32} />
          </Link>

          {/* Bank-Grade Security Pill */}
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Secured Payments</span>
          </div>
        </div>
      </header>

      {/* ── Live Batch Urgency Banner ──────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300 shrink-0" />
        <span>
          Upcoming Live Weekend DSA Masterclass Starts This Saturday • Limited Batch Capacity
        </span>
      </div>

      {/* ── Main Checkout Container ───────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Title & Trust Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Unlock Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              coding75 Pro
            </span>{" "}
            Pass
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Gain immediate, unrestricted access to the complete 150+ DSA master lecture library, weekly interactive live problem-solving classes, live doubt resolution, and curated off-campus job drops.
          </p>
        </div>

        {/* ── Interactive 3-Plan Selection Cards ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
          {Object.values(PRO_PRICING_CONFIG).map((p) => {
            const isSelected = p.id === selectedPlanId;
            const is2Year = p.id === "yearly";
            const isLifetime = p.id === "lifetime";

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlanId(p.id)}
                className={`relative p-4 sm:p-5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? is2Year
                      ? "border-2 border-blue-500 bg-gradient-to-b from-blue-500/10 via-card to-card shadow-xl shadow-blue-500/15 ring-1 ring-blue-500/30 -translate-y-0.5"
                      : isLifetime
                      ? "border-2 border-amber-500 bg-gradient-to-b from-amber-500/10 via-card to-card shadow-xl shadow-amber-500/15 ring-1 ring-amber-500/30 -translate-y-0.5"
                      : "border-2 border-sky-500 bg-gradient-to-b from-sky-500/10 via-card to-card shadow-xl shadow-sky-500/15 ring-1 ring-sky-500/30 -translate-y-0.5"
                    : "border border-border/80 bg-card hover:border-blue-500/30 hover:bg-muted/30 opacity-80 hover:opacity-100"
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-2.5 left-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                      {p.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 pt-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground">{p.name}</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">{p.billingPeriod}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-muted-foreground/40 bg-muted/40"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-border/50">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-muted-foreground line-through font-mono">
                      ₹{p.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    {p.discountPercent}% OFF
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  {p.dailyCostEquivalent === "0" ? "Lifetime Access" : `Equivalent to ${p.dailyCostEquivalent}`}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── 2-Column Checkout Layout ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Real Pedigree, High-Impact Deliverables & Social Proof */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Core Deliverables Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-2 pb-5 border-b border-border/60">
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  Everything you get upon enrollment:
                </h2>
              </div>

              {/* 4 High-Impact Visual Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                    <Video className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    150+ DSA Master Video Lessons
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Personally recorded by Abhinav Awasthi. Complete whiteboard intuition, edge-case analysis, and optimal code in C++, Java, and Python.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                    <Radio className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    Weekly Live DSA Classes
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Interactive weekend sessions breaking down high-frequency interview patterns from Google, Amazon, Microsoft, and high-growth startups.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    Weekly Live Doubt Clearing
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Never stay blocked on a bug or TLE. Bring your doubts directly to live interactive mentor sessions every single week.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    CS Notes &amp; Curated Job Drops
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Interview-ready revision sheets for OS, DBMS, Networks, and System Design (LLD &amp; HLD) + daily verified off-campus hiring alerts.
                  </p>
                </div>
              </div>

              {/* Complete Checklist */}
              <div className="pt-2 space-y-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">
                  Full Feature Roster Included:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-foreground leading-snug font-medium">{feat.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Mentor Pedigree & Authority Card - Loaded dynamically from PRO_MENTORS config */}
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-card via-card to-blue-500/5 p-6 sm:p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Learn Directly From Lead Engineers</span>
                </h3>
                <span className="text-[11px] font-bold text-muted-foreground">
                  5,000+ Students Mentored
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {leadMentors.map((mentor) => (
                  <div
                    key={mentor.name}
                    className="p-3.5 rounded-2xl border border-border/80 bg-background/80 space-y-2.5 flex flex-col justify-between hover:border-blue-500/40 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden relative ring-1 ring-blue-500/30 shrink-0">
                          <Image
                            src={mentor.imagePath}
                            alt={mentor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-xs text-foreground truncate">{mentor.name}</p>
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                            {mentor.company}
                          </p>
                          <p className="text-[9px] text-muted-foreground truncate">
                            {mentor.formerCompany ? `Former ${mentor.formerCompany}` : mentor.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-tight line-clamp-3">
                        {mentor.experienceSummary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[9px] font-medium text-muted-foreground">
                      <span>{mentor.mentoredCount}</span>
                      {mentor.credentials?.[0] && (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[120px]">
                          {mentor.credentials[0]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Floating Student Placement Reviews (Same as in Pro Page) */}
            <div className="rounded-3xl border border-blue-500/20 bg-card p-5 sm:p-6 shadow-sm overflow-hidden [&_.text-slate-900]:dark:text-slate-100 [&_.bg-white]:dark:bg-slate-800 [&_.bg-white]:dark:text-slate-100 [&_.text-slate-300]:dark:text-slate-600">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-1.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                  ))}
                  <span className="text-xs font-black text-foreground ml-1">
                    4.9 / 5.0 Rating
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                  Words that matter • Verified Reviews
                </span>
              </div>

              <FancyTestimonialsSlider testimonials={CHECKOUT_TESTIMONIALS} />
            </div>

            {/* 4. What Happens After You Enroll Roadmap */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                What happens immediately after you enroll:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Instant Dashboard Unlock</p>
                    <p className="text-[11px] text-muted-foreground">All video modules open instantly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-foreground">VIP Community Invite</p>
                    <p className="text-[11px] text-muted-foreground">Direct access to mentors &amp; peer network.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Live Class Calendar</p>
                    <p className="text-[11px] text-muted-foreground">Invites for this weekend&apos;s live class.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Sticky High-Converting Payment Summary Card */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border-2 border-blue-500/40 bg-card/95 backdrop-blur-xl p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
              {/* Subtle Ambient Light Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header & Selected Plan Tag */}
              <div className="space-y-2 pb-4 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Order Summary
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {plan.name}
                  </span>
                </div>

                {/* Plan Daily Cost Hook */}
                {selectedPlanId === "yearly" && (
                  <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Just ₹8 / day — Cheaper than a cup of chai (&lt; ₹10/day)!</span>
                  </div>
                )}
              </div>

              {/* Logged in User Identification */}
              <div className="p-3 rounded-xl border border-border/80 bg-muted/30 flex items-center justify-between text-xs">
                <div className="space-y-0.5 truncate mr-2">
                  <span className="text-[10px] font-bold text-muted-foreground block">
                    Activating On Account:
                  </span>
                  <p className="font-semibold text-foreground truncate">
                    {authLoading ? "Checking account..." : user ? user.email : "Continue to sign in & activate"}
                  </p>
                </div>
                {user ? (
                  <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-1 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-[10px] shrink-0">
                    Google Sign-In
                  </span>
                )}
              </div>

              {/* ── Coupon Code Engine ──────────────────────────────────────── */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-500" />
                    <span>Have a Coupon Code?</span>
                  </span>
                  {appliedCoupon && (
                    <span className="text-emerald-500 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> Applied
                    </span>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <p className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          Discount of{" "}
                          {appliedCoupon.discount_type === "percentage"
                            ? `${appliedCoupon.discount_value}%`
                            : `₹${appliedCoupon.discount_value}`}{" "}
                          applied
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCodeInput}
                        onChange={(e) => {
                          setCouponCodeInput(e.target.value);
                          setCouponError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        className="rounded-xl uppercase font-mono text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={couponLoading || !couponCodeInput.trim()}
                        onClick={() => handleApplyCoupon()}
                        className="rounded-xl text-xs font-bold shrink-0 cursor-pointer border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
                      >
                        {couponLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] font-semibold text-rose-500">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ── Transparent Price Breakdown Table ────────────────────────── */}
              <div className="space-y-2.5 pt-3 border-t border-border/60 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Regular Total Fee</span>
                  <span className="line-through font-mono">
                    ₹{plan.originalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span>coding75 Pro Tier Price</span>
                  <span className="font-mono font-semibold text-foreground">
                    ₹{basePrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Standard Tier Savings ({plan.discountPercent}% OFF)</span>
                  <span className="font-mono">
                    -₹{(plan.originalPrice - basePrice).toLocaleString("en-IN")}
                  </span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                    </span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {/* Final Total */}
                <div className="pt-3 border-t border-border/80 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-black text-foreground block">
                      Total Payable Amount
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      All taxes included • No hidden renewal traps
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                      ₹{finalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Primary Payment Button ───────────────────────────────────── */}
              <div className="space-y-3 pt-2">
                <Button
                  type="button"
                  size="lg"
                  disabled={isProcessingPayment}
                  onClick={handleProceedToPayment}
                  className="w-full h-14 rounded-2xl font-black text-sm sm:text-base gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all cursor-pointer active:scale-[0.98] ring-2 ring-blue-400/20"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Initializing Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-blue-200" />
                      <span>Pay ₹{finalPrice.toLocaleString("en-IN")} &amp; Unlock Pro</span>
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </>
                  )}
                </Button>

                {/* Verified Gateway & Payment Options */}
                <div className="space-y-2 pt-1 text-center">
                  <p className="text-[11px] font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Secure Checkout, Powered by Razorpay</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 leading-tight">
                    UPI (Google Pay, PhonePe, Paytm) • Cards (Visa, Mastercard, RuPay) • NetBanking • EMI
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Mentor Guidance Button */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Questions about curriculum or payment?</span>
              </div>
              <a
                href={whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 cursor-pointer"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* ── Exit Intent Retention Modal ─────────────────────────────────────── */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-blue-500/40 bg-card p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <button
              type="button"
              onClick={() => {
                setShowExitModal(false);
                setExitModalDismissed(true);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <Gift className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Special Exit Gift
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Wait! Don&apos;t Leave Your Preparation Behind
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Take an extra <strong>10% discount</strong> today. Use this code to start preparing with our lead mentors right now.
              </p>
            </div>

            {/* Promo Code Box */}
            <div className="p-3 rounded-2xl border border-dashed border-blue-500/40 bg-blue-500/5 space-y-1">
              <div className="text-lg font-black font-mono tracking-widest text-blue-600 dark:text-blue-400">
                PRO10
              </div>
              <p className="text-[11px] text-muted-foreground">
                Instantly saves 10% on {plan.name}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <Button
                type="button"
                className="w-full h-11 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 cursor-pointer"
                onClick={() => {
                  setShowExitModal(false);
                  setExitModalDismissed(true);
                  handleApplyCoupon("PRO10");
                }}
              >
                <span>Apply PRO10 &amp; Continue</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <button
                type="button"
                onClick={() => {
                  setShowExitModal(false);
                  setExitModalDismissed(true);
                }}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
              >
                No thanks, I will pay regular price
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-semibold text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
