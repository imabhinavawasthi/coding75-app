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

    // Get user id from users table
    const { data: userRow } = await supabase
      .from("users")
      .select("id")
      .eq("user_email", authUser.email)
      .maybeSingle();

    if (!userRow) {
      return NextResponse.json({ items: [] });
    }

    // Fetch transactions
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userRow.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: transactions || [] });
  } catch (err: any) {
    console.error("Error in transactions GET:", err);
    return NextResponse.json({ items: [] });
  }
}
