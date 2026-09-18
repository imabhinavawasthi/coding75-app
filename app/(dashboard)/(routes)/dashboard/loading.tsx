import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Hero Header Skeleton with 3 Action Cards below */}
      <div className="relative overflow-hidden bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="space-y-2.5 max-w-2xl">
          <Skeleton className="h-8 sm:h-9 w-64 sm:w-80 rounded-xl" />
          <Skeleton className="h-3.5 w-full max-w-xl rounded-md" />
        </div>

        {/* 3 Action Cards below title */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>

      {/* 2. Compact Upcoming Class Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 p-4 sm:p-5 bg-card/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-6 w-60 rounded-md" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-3.5 w-36 rounded" />
            <Skeleton className="h-3.5 w-20 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* 3. Spotlight Banner Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 p-5 sm:p-6 bg-card/60">
        <div className="flex flex-col md:flex-row md:md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-36 rounded-full" />
                <Skeleton className="h-4 w-44 rounded-md" />
              </div>
              <Skeleton className="h-6 w-72 sm:w-96 rounded-lg" />
              <Skeleton className="h-3.5 w-80 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Skeleton className="h-10 w-44 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 3. Section 1 Skeleton: DSA & Problem Solving */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-44 rounded" />
            <Skeleton className="h-6 w-60 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-28 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/70 p-5 bg-card/60 flex flex-col justify-between h-56 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-5 w-36 rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded pt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Section 2 Skeleton: Engineering & Interview Preparation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-44 rounded" />
            <Skeleton className="h-6 w-64 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-28 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/70 p-5 bg-card/60 flex flex-col justify-between h-56 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-5 w-36 rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded pt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Section 3 Skeleton: Career Tools */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-6 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-28 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/70 p-5 bg-card/60 flex flex-col justify-between h-52 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                </div>
                <Skeleton className="h-5 w-40 rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-3/4 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
