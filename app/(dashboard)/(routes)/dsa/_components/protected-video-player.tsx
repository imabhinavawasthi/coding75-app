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

  return (
    <div
      className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-lg flex items-center justify-center select-none group ${className}`}
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
        className="w-full h-full border-0 absolute inset-0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* 
        PHYSICAL POP-OUT CLICK SHIELDS:
        Google Drive's preview player renders a "Pop-out" / open in separate window icon in the top-right corner.
        These invisible DOM shields sit directly over that zone with higher z-index, intercepting all clicks
        and right-clicks, making it physically impossible for the end user to click the pop-out button.
      */}
      <div
        className="absolute top-0 right-0 w-24 sm:w-28 h-16 z-30 pointer-events-auto bg-transparent cursor-default"
        title=""
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
      
      <div
        className="absolute top-0 left-0 right-24 sm:right-28 h-14 z-20 pointer-events-auto bg-transparent cursor-default"
        title=""
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </div>
  );
};
