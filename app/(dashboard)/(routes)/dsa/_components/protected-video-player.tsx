"use client";

import React, { useState, useRef } from "react";
import { PlayCircle, Shield, AlertCircle } from "lucide-react";

interface ProtectedVideoPlayerProps {
  embedUrl: string | null;
  title: string;
  className?: string;
}

export const ProtectedVideoPlayer: React.FC<ProtectedVideoPlayerProps> = ({
  embedUrl,
  title,
  className = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!embedUrl) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-border shadow-md flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground p-6 space-y-2">
          <PlayCircle size={44} className="mx-auto opacity-40 text-primary" />
          <p className="text-xs font-semibold text-foreground">Lecture stream is being initialized</p>
          <p className="text-[11px] text-muted-foreground">Classroom video stream will be accessible here shortly.</p>
        </div>
      </div>
    );
  }

  const isDirectDrive = typeof embedUrl === "string" && (embedUrl.includes("drive.google.com") || embedUrl.includes("docs.google.com"));

  return (
    <div
      className={`relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-border shadow-lg flex items-center justify-center select-none group touch-manipulation ${className}`}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      {/* Loading placeholder until iframe loads */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 space-y-2">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-muted-foreground font-bold">Connecting secure classroom stream...</span>
        </div>
      )}

      {/* Sandboxed Video Player Frame */}
      <iframe
        src={embedUrl}
        title={title}
        className={`w-full absolute inset-x-0 border-0 ${
          isDirectDrive
            ? "-top-12 sm:-top-14 h-[calc(100%+48px)] sm:h-[calc(100%+56px)]"
            : "inset-0 h-full"
        }`}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* Top Edge Guard for direct drive embeds to prevent pixel bleed */}
      {isDirectDrive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black z-10 pointer-events-none" />
      )}
    </div>
  );
};
