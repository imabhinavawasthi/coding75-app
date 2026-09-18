"use client";

import React, { useState, useEffect } from "react";
import { Video, BookOpen, ExternalLink, Play } from "lucide-react";
import Link from "next/link";

interface RelatedArticle {
  id?: string;
  title: string;
  slug: string;
}

interface ProblemEditorialProps {
  videoIds?: string[];
  articles?: RelatedArticle[];
}

export const ProblemEditorial: React.FC<ProblemEditorialProps> = ({ videoIds = [], articles = [] }) => {
  const [videoDetails, setVideoDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(videoIds.length > 0);

  useEffect(() => {
    if (!videoIds || videoIds.length === 0) {
      setLoading(false);
      return;
    }

    const loadVideos = async () => {
      try {
        setLoading(true);
        const fetched = await Promise.all(
          videoIds.map(async (id) => {
            try {
              const res = await fetch(`/api/videos/${encodeURIComponent(id)}`);
              if (!res.ok) return null;
              const data = await res.json();
              return data.video || null;
            } catch {
              return null;
            }
          })
        );
        setVideoDetails(fetched.filter(Boolean));
      } catch (err) {
        console.error("Failed to load video editorials:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [videoIds]);

  const hasVideos = videoDetails.length > 0 || videoIds.length > 0;
  const hasArticles = articles && articles.length > 0;

  if (!hasVideos && !hasArticles) {
    return (
      <div className="py-12 text-center space-y-3 bg-card border rounded-2xl p-6">
        <Video size={36} className="mx-auto text-muted-foreground/50" />
        <h3 className="text-sm font-bold text-foreground">No Editorial Resources Yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Video walkthroughs and deep-dive conceptual articles for this problem will appear here once published.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Video Lectures */}
      {hasVideos && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Video size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Video Walkthroughs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videoDetails.map((v, i) => (
              <Link
                key={v.id || i}
                href={`/video/${v.id || videoIds[i]}`}
                className="group border rounded-2xl p-4 bg-card hover:bg-muted/50 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                    Lecture {i + 1}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={12} className="ml-0.5" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-foreground line-clamp-2">
                  {v.title || `Video Explanation #${i + 1}`}
                </h4>
                {v.duration_minutes && (
                  <span className="text-[10px] text-muted-foreground">
                    {v.duration_minutes} mins
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      {hasArticles && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Related Articles & Reading</span>
          </div>

          <div className="space-y-2">
            {articles.map((art, i) => (
              <a
                key={art.id || i}
                href={`/articles/${art.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
              >
                <span className="text-xs font-semibold text-foreground truncate pr-2">
                  {art.title}
                </span>
                <ExternalLink size={13} className="text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemEditorial;
