"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DSATopicModule } from "@/config/dsa-catalog";
import { DSATopicCard } from "./dsa-topic-card";

interface DSACarouselSectionProps {
  title: string;
  description: string;
  modules: DSATopicModule[];
  isLoading?: boolean;
}

export function DSACarouselSection({
  title,
  description,
  modules,
  isLoading,
}: DSACarouselSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -330 : 330;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="space-y-4">
      {/* Section Header with Left / Right Scroll Controls */}
      <div className="flex items-end justify-between border-b pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <h2 className="text-xl font-black tracking-tight text-foreground">
              {title}
            </h2>
          </div>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            {description}
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-xl border bg-card text-foreground hover:bg-muted transition-all shadow-xs"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-xl border bg-card text-foreground hover:bg-muted transition-all shadow-xs"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4 pt-1 px-1 -mx-1"
      >
        {isLoading
          ? [1, 2, 3, 4].map((idx) => (
              <DSATopicCard
                key={idx}
                module={modules[0] || { id: "skeleton", title: "Loading...", category: "foundations", categoryLabel: "Foundations", description: "", icon: () => null, difficulty: "Beginner", topics: [] }}
                isLoading
                layout="carousel"
              />
            ))
          : modules.map((module) => (
              <DSATopicCard key={module.id} module={module} layout="carousel" />
            ))}
      </div>
    </section>
  );
}
