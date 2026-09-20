import { getValidAccessToken } from "./auth-client";

function getAuthHeaders(token?: string | null): HeadersInit {
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
}

export async function fetchEligibleCoupons(purchaseType = "pro_subscription", targetId = "yearly") {
  try {
    const url = new URL("/api/checkout/coupons", window.location.origin);
    url.searchParams.set("purchase_type", purchaseType);
    url.searchParams.set("target_id", targetId);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return { coupons: [] };
    return res.json();
  } catch (err) {
    console.error("fetchEligibleCoupons error:", err);
    return { coupons: [] };
  }
}

export async function validateCoupon(code: string, purchaseType = "pro_subscription", targetId = "yearly") {
  const res = await fetch("/api/checkout/apply-coupon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      purchase_type: purchaseType,
      target_id: targetId,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.valid) {
    throw new Error(data.message || "Invalid coupon code");
  }

  return data;
}

export async function createCheckoutOrder(
  purchaseType = "pro_subscription",
  targetId = "yearly",
  couponCode?: string
) {
  const token = await getValidAccessToken();
  const res = await fetch("/api/checkout/create-order", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      purchase_type: purchaseType,
      target_id: targetId,
      coupon_code: couponCode || undefined,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || "Failed to create order");
  }

  return data;
}

export async function verifyCheckoutPayment(payload: {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  transaction_id: string;
}) {
  const token = await getValidAccessToken();
  const res = await fetch("/api/checkout/verify", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || "Payment verification failed");
  }

  return data;
}

export async function fetchUserTransactions() {
  const token = await getValidAccessToken();
  const res = await fetch("/api/checkout/transactions", {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    return { items: [] };
  }

  return res.json();
}

export async function fetchUserSubscription() {
  const token = await getValidAccessToken();
  const res = await fetch("/api/checkout/subscription", {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    return { is_pro_active: false, pro_subscription: null };
  }

  return res.json();
}

/**
 * Loads Razorpay script dynamically
 */
export function loadRazorpaySDK(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existingScript = document.getElementById("razorpay-checkout-sdk");
    if (existingScript) {
      existingScript.onload = () => resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
