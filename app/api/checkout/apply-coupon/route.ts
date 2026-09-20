import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../_lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, purchase_type = "pro_subscription", target_id = "" } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const supabase = getSupabaseServerClient();

    // Query coupon by code
    const { data: coupons, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", cleanCode)
      .eq("is_active", true)
      .limit(1);

    if (error || !coupons || coupons.length === 0) {
      return NextResponse.json({
        valid: false,
        message: "Invalid or inactive coupon code",
      });
    }

    const coupon = coupons[0];

    // Check max uses
    if (
      coupon.max_uses !== null &&
      coupon.max_uses !== undefined &&
      coupon.used_count >= coupon.max_uses
    ) {
      return NextResponse.json({
        valid: false,
        message: "Coupon usage limit has been reached",
      });
    }

    // Check expiration
    if (coupon.valid_until) {
      const validUntil = new Date(coupon.valid_until);
      if (new Date() > validUntil) {
        return NextResponse.json({
          valid: false,
          message: "Coupon has expired",
        });
      }
    }

    // Check applicability
    const appList: string[] = Array.isArray(coupon.applicable_to)
      ? coupon.applicable_to
      : [];
    let isApplicable = false;

    if (appList.includes("ALL")) {
      isApplicable = true;
    } else if (
      purchase_type === "pro_subscription" &&
      (appList.includes("PRO") || appList.includes("pro_subscription"))
    ) {
      isApplicable = true;
    } else if (target_id && appList.includes(target_id)) {
      isApplicable = true;
    }

    if (!isApplicable) {
      return NextResponse.json({
        valid: false,
        message: "Coupon is not applicable for this purchase",
      });
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: Number(coupon.discount_value),
      message: `Coupon ${coupon.code} applied successfully!`,
    });
  } catch (err: any) {
    console.error("Error in apply-coupon:", err);
    return NextResponse.json(
      { valid: false, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
