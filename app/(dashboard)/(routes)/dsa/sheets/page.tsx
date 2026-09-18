import React from "react";
import Link from "next/link";
import { getSupabaseServerClient } from "@/app/api/_lib/supabase-server";
import DSASheetCard from "@/components/dsa/dsa-sheet-card";
import PremiumPageHeader from "@/components/page-headers/premium-page-header";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "DSA and CP Sheets | crackDSA",
  description: "Curated collection of DSA sheets with progress tracking and solutions.",
};

export default async function DSASheetsPage() {
  const supabase = getSupabaseServerClient();
  
  // Fetch active and public sheets
  const { data: sheets, error } = await supabase
    .from("dsa_sheets")
    .select("id, title, description, level, tags, sheet_json")
    .eq("is_active", true)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching DSA sheets:", error);
  }

  // Define the legacy expert sheet
  const expertSheet = {
    id: "expert-sheet",
    title: "Newbie → Expert CP Sheet",
    description: "Hand Picked Codeforces Problems with Video Editorials. Essential for mastering competitive programming and solving advanced questions.",
    level: "advanced",
    tags: ["Codeforces", "CP", "Advanced"],
    total_topics: 10,
    total_problems: 150,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-8 pb-20 select-none">
      <PremiumPageHeader 
        title="DSA and CP Sheets" 
        subtitle="Prepare effectively with organized sheets, progress tracking, and video editorials." 
      />

      {/* Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Featured Collections
          </h2>
          <span className="text-xs font-semibold text-muted-foreground">
            {(sheets?.length || 0) + 1} Sheets Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hardcoded Expert Sheet */}
          <DSASheetCard sheet={expertSheet as any} />
          
          {/* Dynamic Sheets */}
          {sheets?.map((sheet) => (
            <DSASheetCard key={sheet.id} sheet={sheet as any} />
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-12 p-8 rounded-3xl border border-dashed border-border bg-card/50 text-center space-y-4">
        <h3 className="text-lg font-bold text-foreground">Didn't find what you're looking for?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We are constantly curating new preparation collections based on community feedback and the latest interview trends.
        </p>
        <Link 
          href="https://wa.me/918949826359"
          target="_blank"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-muted text-foreground font-semibold rounded-lg text-sm hover:bg-accent transition-colors"
        >
          Suggest via WhatsApp
        </Link>
      </div>
    </div>
  );
}
