"use client"

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PaymentCallback() {
  const router = useRouter();
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = router.query;

  useEffect(() => {
    console.log("Payment Response:", razorpay_payment_id, razorpay_order_id, razorpay_signature);
    // You can call your backend to verify signature
  }, [router.query]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Payment ID: {razorpay_payment_id}</p>
    </div>
  );
}
