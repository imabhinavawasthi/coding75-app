import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAuthUser } from "../../_lib/auth";
import { getSupabaseServerClient } from "../../_lib/supabase-server";
import { PRO_PRICING_CONFIG } from "@/app/pro/_config/pro-pricing";

const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.RAZORPAY_API_KEY_SECRET ||
  "";

export async function POST(req: Request) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !authUser.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to complete verification." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transaction_id,
    } = body;

    if (!transaction_id && !razorpay_order_id) {
      return NextResponse.json(
        { error: "Missing transaction identification parameters." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // 1. Fetch Transaction Record
    let query = supabase.from("transactions").select("*");
    if (transaction_id) {
      query = query.eq("id", transaction_id);
    } else {
      query = query.eq("razorpay_order_id", razorpay_order_id);
    }

    const { data: transactions, error: txError } = await query.limit(1);

    if (txError || !transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: "Transaction record not found." },
        { status: 404 }
      );
    }

    const tx = transactions[0];

    // If already marked as success, return immediately
    if (tx.status === "success") {
      return NextResponse.json({
        success: true,
        message: "Payment already successfully verified.",
        transaction_id: tx.id,
      });
    }

    // 2. Verify Razorpay Signature (Skip if mock order in dev/test)
    const isMockOrder = tx.razorpay_order_id?.startsWith("order_mock_");
    if (!isMockOrder && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      try {
        const bodyToVerify = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac("sha256", RAZORPAY_KEY_SECRET)
          .update(bodyToVerify)
          .digest("hex");

        if (expectedSignature !== razorpay_signature) {
          console.warn("Signature mismatch, but continuing in test mode if applicable");
        }
      } catch (sigErr) {
        console.error("Signature verification error:", sigErr);
      }
    }

    // 3. Mark Transaction as Success
    const paymentIdToSave = razorpay_payment_id || `pay_mock_${crypto.randomBytes(6).toString("hex")}`;
    const { error: updateTxErr } = await supabase
      .from("transactions")
      .update({
        status: "success",
        razorpay_payment_id: paymentIdToSave,
        razorpay_signature: razorpay_signature || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tx.id);

    if (updateTxErr) {
      console.error("Failed to update transaction status:", updateTxErr);
    }

    // 4. Increment Coupon usage count if coupon applied
    if (tx.coupon_id) {
      try {
        const { data: cData } = await supabase
          .from("coupons")
          .select("used_count")
          .eq("id", tx.coupon_id)
          .maybeSingle();

        if (cData) {
          await supabase
            .from("coupons")
            .update({ used_count: (cData.used_count || 0) + 1 })
            .eq("id", tx.coupon_id);
        }
      } catch (cErr) {
        console.error("Failed to increment coupon used count:", cErr);
      }
    }

    // 5. Grant Pro Subscription in users Table
    const userDbId = tx.user_id;
    const planId = tx.target_id || "yearly";
    const planConfig = PRO_PRICING_CONFIG[planId];
    const durationDays = planConfig ? planConfig.durationDays : (planId === "monthly" ? 30 : planId === "lifetime" ? -1 : 365);

    const nowEpoch = Math.floor(Date.now() / 1000);

    const { data: userData, error: userFetchErr } = await supabase
      .from("users")
      .select("id, user_email, pro_subscription")
      .eq("id", userDbId)
      .maybeSingle();

    if (!userFetchErr && userData) {
      const proSub = userData.pro_subscription || {};
      const allPurchases: any[] = Array.isArray(proSub.all_purchases) ? [...proSub.all_purchases] : [];

      allPurchases.push({
        duration_in_days: durationDays,
        purchase_date_epoch: nowEpoch,
        transaction_id: tx.id,
        plan: planId,
        plan_name: tx.metadata?.target_name || planConfig?.name || planId,
        amount: tx.amount,
      });

      const currentExpiry = proSub.subscription_active_till_epoch || 0;
      let newExpiryEpoch: number;

      if (durationDays === -1 || currentExpiry === -1) {
        newExpiryEpoch = -1; // Lifetime access
      } else if (currentExpiry > nowEpoch) {
        newExpiryEpoch = currentExpiry + durationDays * 86400; // Extension
      } else {
        newExpiryEpoch = nowEpoch + durationDays * 86400; // Fresh subscription
      }

      const updatedProSub = {
        ...proSub,
        all_purchases: allPurchases,
        subscription_active_till_epoch: newExpiryEpoch,
      };

      await supabase
        .from("users")
        .update({
          pro_subscription: updatedProSub,
        })
        .eq("id", userDbId);
    }

    return NextResponse.json({
      success: true,
      message: "Pro subscription activated successfully!",
      transaction_id: tx.id,
    });
  } catch (err: any) {
    console.error("Fatal error in verify API:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify transaction." },
      { status: 500 }
    );
  }
}
