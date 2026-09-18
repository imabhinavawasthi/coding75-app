import React from "react";

interface PremiumPageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export default function PremiumPageHeader({
  title,
  subtitle,
  children,
  badge,
  className = "",
}: PremiumPageHeaderProps) {
  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-violet-600/10 via-background to-background p-8 md:p-12 flex flex-col items-center justify-center text-center ${className}`}>
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-violet-500/20 rounded-full blur-[100px] pointer-events-none" />
      
      {badge && (
        <div className="mb-4 relative z-10 flex items-center justify-center">
          {badge}
        </div>
      )}

      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground relative z-10 leading-tight">
        {title}
      </h1>
      
      {subtitle && (
        <p className="mt-4 text-sm md:text-base text-muted-foreground font-medium max-w-2xl relative z-10 leading-relaxed">
          {subtitle}
        </p>
      )}

      {children && (
        <div className="mt-8 relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          {children}
        </div>
      )}
    </div>
  );
}
