import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../_lib/supabase-server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const purchaseType = searchParams.get("purchase_type") || "pro_subscription";
    const targetId = searchParams.get("target_id") || "";

    const supabase = getSupabaseServerClient();

    // Query active coupons
    const { data: coupons, error } = await supabase
      .from("coupons")
      .select("id, code, discount_type, discount_value, max_uses, used_count, valid_until, applicable_to")
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching coupons:", error);
      return NextResponse.json({ coupons: [] });
    }

    const now = new Date();
    const eligible = (coupons || []).filter((c) => {
      // Check max uses
      if (c.max_uses !== null && c.max_uses !== undefined && c.used_count >= c.max_uses) {
        return false;
      }

      // Check expiration
      if (c.valid_until) {
        const validUntil = new Date(c.valid_until);
        if (now > validUntil) {
          return false;
        }
      }

      // Check applicability
      const appList: string[] = Array.isArray(c.applicable_to) ? c.applicable_to : [];
      if (appList.includes("ALL")) return true;
      if (purchaseType === "pro_subscription" && (appList.includes("PRO") || appList.includes("pro_subscription"))) {
        return true;
      }
      if (targetId && appList.includes(targetId)) return true;

      return false;
    });

    const formatted = eligible.map((c) => ({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: Number(c.discount_value),
    }));

    return NextResponse.json({ coupons: formatted });
  } catch (err: any) {
    console.error("Error in coupons GET:", err);
    return NextResponse.json({ coupons: [] });
  }
}
