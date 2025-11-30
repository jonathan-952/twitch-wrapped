import { EyeIcon, ClockIcon } from "@/components/icons";
import { StreamersData } from "@/page";
import { Clip } from "@/client-components/clips-view";
import { useState } from "react";

interface ClipCardProps {
  clip: Clip;
}

function formatViews(views: number): string {
  console.log(views);
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export function ClipCard({ clip}: ClipCardProps) {
  console.log(clip);
  const [playing, setPlaying] = useState(false);
  const embedUrl = clip.embed_url + "&parent=localhost&autoplay=true";

  return (
    <div className="group cursor-pointer">
      <div
        className="relative overflow-hidden rounded-md bg-card mb-2 aspect-video"
        onClick={() => setPlaying(!playing)}
      >
        {playing ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        ) : (
          <>
            <img
              src={clip.thumbnail_url}
              alt={clip.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 rounded-full p-3 text-white">▶</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
