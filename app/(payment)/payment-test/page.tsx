"use client"

import Script from "next/script";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log(window.Razorpay); // will now exist after script loads
  }, []);

  const pay = () => {
    const options = {
      key: "rzp_test_RQg59f6j03EFj3", // Razorpay Key ID
      amount: 50000, // in paise (₹500 = 50000 paise)
      currency: "INR",
      name: "My Store",
      description: "Test Transaction",
      order_id: "order_RQhJ8IJULNWmzQ", // Optional, pre-created in Razorpay
      handler: function (response) {
        console.log(response);
        // Here you can redirect or show success message
      },
      theme: { color: "#3399cc" },
      modal: { ondismiss: function () { console.log("Checkout closed"); } },
      redirect: true,
      callback_url: "http://localhost:3000/payment-callback",
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      <button onClick={pay}>Pay Now</button>
    </div>
  );
}
