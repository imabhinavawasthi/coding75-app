"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

const BorderAnimationButton = ({
  url,
  icon: Icon,
  text,
  className,
}: {
  url: string
  icon?: React.ElementType
  text: string
  className?: string
}) => {
  return (
    <Link
      href={url}
      className={cn(
        "relative inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-xl",
        "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-[2px]", // gradient border
        "transition-all duration-300 hover:scale-[1.02]",
        // nice layered shadow
        "shadow-[0_4px_12px_rgba(0,0,0,0.25),0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.3),0_0_20px_rgba(59,130,246,0.4)]",
        className
      )}
    >
      {/* Inner dark container */}
      <span className="flex items-center gap-2 w-full h-full rounded-[10px] bg-[#1e293b] text-gray-100 px-5 py-2">
        {text}
        {Icon && <Icon className="w-5 h-5" />}
      </span>
    </Link>
  )
}

export default BorderAnimationButton
