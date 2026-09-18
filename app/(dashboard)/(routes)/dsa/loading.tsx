import { Skeleton } from "@/components/ui/skeleton";

export default function DsaLoading() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-xl" />
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-72 sm:w-96 rounded-md" />
          </div>
          <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
        </div>
      </div>

      {/* 2. Filter Pills Skeleton */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* 3. Carousel Section 1 Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-6 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-3.5 w-64 rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="w-8 h-8 rounded-xl" />
          </div>
        </div>

        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[280px] sm:w-[310px] shrink-0 rounded-2xl border border-border/70 overflow-hidden bg-card/60 space-y-3"
            >
              <Skeleton className="h-36 w-full rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded" />
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <Skeleton className="h-4 w-10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Carousel Section 2 Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-6 w-52 rounded-lg" />
            </div>
            <Skeleton className="h-3.5 w-72 rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="w-8 h-8 rounded-xl" />
          </div>
        </div>

        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[280px] sm:w-[310px] shrink-0 rounded-2xl border border-border/70 overflow-hidden bg-card/60 space-y-3"
            >
              <Skeleton className="h-36 w-full rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded" />
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <Skeleton className="h-4 w-10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
