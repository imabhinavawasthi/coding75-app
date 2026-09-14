import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  white?: boolean;
  className?: string;
}

export const Logo = ({
  width = 140,
  height = 36,
  white = false,
  className,
}: LogoProps) => {
  const logoSrc = white ? "/logo-bg-white.png" : "/logo-bg.png";

  return (
    <div className={cn("inline-flex items-center select-none", className)}>
      <Image
        src={logoSrc}
        alt="coding75 logo"
        width={width}
        height={height}
        className="object-contain h-auto w-auto max-h-10 transition-transform duration-200"
        priority
      />
    </div>
  );
};