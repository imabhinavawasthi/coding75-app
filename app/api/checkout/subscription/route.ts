import { NextResponse } from "next/server";
import { getAuthUser } from "../../_lib/auth";
import { getSupabaseServerClient } from "../../_lib/supabase-server";

export async function GET(req: Request) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || !authUser.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: userRow, error } = await supabase
      .from("users")
      .select("id, user_email, pro_subscription")
      .eq("user_email", authUser.email)
      .maybeSingle();

    if (error || !userRow) {
      return NextResponse.json({
        is_pro_active: false,
        pro_subscription: null,
      });
    }

    const proSub = userRow.pro_subscription || {};
    const expiryEpoch = proSub.subscription_active_till_epoch || 0;
    const nowEpoch = Math.floor(Date.now() / 1000);

    const isProActive = expiryEpoch === -1 || expiryEpoch > nowEpoch;

    return NextResponse.json({
      is_pro_active: isProActive,
      pro_subscription: proSub,
      user_email: userRow.user_email,
    });
  } catch (err: any) {
    console.error("Error in subscription GET:", err);
    return NextResponse.json(
      { is_pro_active: false, pro_subscription: null },
      { status: 500 }
    );
  }
}
