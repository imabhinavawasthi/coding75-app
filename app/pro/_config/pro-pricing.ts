/**
 * Centralized Pro Pricing Configuration for coding75 Pro
 * Easy to edit prices, discounts, and plan features in one place.
 */

export interface ProPricingTier {
  id: "monthly" | "yearly" | "lifetime";
  name: string;
  tagline: string;
  price: number; // in INR
  originalPrice: number; // in INR
  durationDays: number; // 30, 365, -1 for lifetime
  billingPeriod: string;
  dailyCostEquivalent: string;
  discountPercent: number;
  highlighted?: boolean;
  badge?: string;
  savingsNote: string;
  features: { title: string; subtitle?: string; included: boolean }[];
}

export const PRO_PRICING_CONFIG: Record<string, ProPricingTier> = {
  monthly: {
    id: "monthly",
    name: "Monthly Pro",
    tagline: "High-intensity interview preparation with flexible monthly commitment.",
    price: 799,
    originalPrice: 1599,
    durationDays: 30,
    billingPeriod: "per month",
    dailyCostEquivalent: "₹26 / day",
    discountPercent: 50,
    badge: "⚡ Flexible • Monthly Access",
    savingsNote: "Save ₹800 every month",
    features: [
      { title: "Complete DSA Course & Video Lectures", included: true },
      { title: "Weekly Live DSA Classes (Interactive Problem Solving)", included: true },
      { title: "Weekly Live Doubt Clearing Classes", included: true },
      { title: "CS Fundamentals Notes (OS, DBMS, Networks)", included: true },
      { title: "System Design Notes (LLD & HLD)", included: true },
      { title: "Free Access to all Competitive Programming Content", included: true },
      { title: "Pro Telegram/Discord Community Access", included: true },
      { title: "Curated Tech Opportunities & Job Drops", included: true },
      { title: "Access to Live & Recorded Masterclasses", included: true },
    ],
  },
  yearly: {
    id: "yearly",
    name: "2-Year Pro Pass",
    tagline: "Complete college preparation access. Full 2 years of live classes, continuous doubt resolution, and placement drops.",
    price: 5999,
    originalPrice: 15999,
    durationDays: 730,
    billingPeriod: "for 2 years (24 months)",
    dailyCostEquivalent: "₹8 / day",
    discountPercent: 62,
    highlighted: true,
    badge: "🚀 Complete College Prep",
    savingsNote: "Save ₹10,000 (Full 2-year college prep access for <₹8/day)",
    features: [
      { title: "Complete DSA Course & Video Lectures", included: true },
      { title: "Weekly Live DSA Classes throughout 2 Full Years (730 Days)", included: true },
      { title: "Weekly Live Doubt Clearing with Lead Mentors", included: true },
      { title: "CS Fundamentals Notes (OS, DBMS, Networks)", included: true },
      { title: "System Design Notes (LLD & HLD)", included: true },
      { title: "Free Access to all Competitive Programming Content", included: true },
      { title: "VIP Pro Community + Priority Mentor Chat", included: true },
      { title: "Curated Tech Opportunities & Daily Hiring Drops", included: true },
      { title: "Access to all Upcoming Masterclasses & Workshops", included: true },
    ],
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime Member Pass",
    tagline: "Pay once, learn forever. Unrestricted lifetime access across your entire software engineering career.",
    price: 9999,
    originalPrice: 29999,
    durationDays: -1,
    billingPeriod: "one-time payment",
    dailyCostEquivalent: "0",
    discountPercent: 67,
    badge: "👑 Ultimate Career Pass",
    savingsNote: "Save ₹20,000 forever with zero renewal fees",
    features: [
      { title: "Permanent Lifetime Access to Complete DSA Curriculum", included: true },
      { title: "All Future Live Batches & Updated Lecture Modules", included: true },
      { title: "Permanent Weekly Live Doubt Clearing Access", included: true },
      { title: "Lifetime CS Fundamentals & System Design Updates", included: true },
      { title: "All Future Competitive Programming Roadmaps", included: true },
      { title: "Lifetime Membership in Pro Alumni Network", included: true },
      { title: "Perpetual Curated Tech Opportunities & Hiring Drops", included: true },
      { title: "Every Future Masterclass & Tech Bootcamp Included", included: true },
    ],
  },
};

export const PRO_PRICING_PLANS: ProPricingTier[] = Object.values(PRO_PRICING_CONFIG);

/**
 * Helper to get a pricing plan by ID with safe fallback to yearly
 */
export function getProPlanById(planId?: string | null): ProPricingTier {
  if (!planId) return PRO_PRICING_CONFIG.yearly;
  return PRO_PRICING_CONFIG[planId] || PRO_PRICING_CONFIG.yearly;
}
