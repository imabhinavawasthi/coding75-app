"use client"

import { useEffect, useState } from "react"
import { Poppins } from "next/font/google"
import { ArrowRight } from "lucide-react"
import BorderAnimationButton from "./border-animation-button"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["600", "700"],
})

export default function SalesTimer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        // Example: 24-hour sale
        const saleEnd = new Date()
        saleEnd.setHours(saleEnd.getHours() + 24)

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = saleEnd.getTime() - now

            if (distance <= 0) {
                clearInterval(interval)
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
            } else {
                setTimeLeft({
                    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((distance / (1000 * 60)) % 60),
                    seconds: Math.floor((distance / 1000) % 60),
                })
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-5 px-4 shadow-md">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
                {/* Limited Slots Text */}
                <div className="text-center md:text-left">
                    <p className="text-sm uppercase tracking-[0.2em] text-gray-300">
                        🚀 Limited Slots Available
                    </p>
                    <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text mt-1">
                        Special Discount Ending Soon!
                    </h2>
                </div>

                {/* Timer */}
                <div className="flex items-center gap-2 font-mono text-base md:text-lg bg-black/30 px-3 py-1 rounded-lg">
                    <span className="font-bold">{String(timeLeft.hours).padStart(2, "0")}</span>h :
                    <span className="font-bold">{String(timeLeft.minutes).padStart(2, "0")}</span>m :
                    <span className="font-bold">{String(timeLeft.seconds).padStart(2, "0")}</span>s
                </div>

                {/* Discount Highlight */}
                <div className="bg-green-500 text-black font-bold px-3 py-1 rounded-lg text-sm md:text-base">
                    Save 60%
                </div>

                <BorderAnimationButton
                    text={"Register Now"}
                    url="/"
                    icon={ArrowRight}
                />
            </div>
        </div>
    )
}
