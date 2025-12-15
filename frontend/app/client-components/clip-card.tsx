"use client"

import { useState } from "react"
import { EyeIcon } from "@/components/icons"
import { Clip } from "@/client-components/clips-view"

interface ClipCardProps {
  clip: Clip
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`
  return views.toString()
}

export function ClipCard({ clip }: ClipCardProps) {
  const [playing, setPlaying] = useState(false)
  const embedUrl = clip.embed_url + "&parent=localhost&autoplay=true"

  const isTrending = clip.TrendingScore && clip.TrendingScore > 10

  // Determine retention label
  let retentionLabel = "Stagnant"
  let retentionColor = "bg-gray-700"
  if (clip.Retention === "high") {
    retentionLabel = "Growing"
    retentionColor = "bg-emerald-600"
  } else if (clip.Retention === "medium") {
    retentionLabel = "Steady"
    retentionColor = "bg-yellow-500"
  }

  return (
    <div className="group cursor-pointer">
      <div
        className="relative overflow-hidden rounded-lg bg-card mb-2 aspect-video shadow hover:shadow-lg transition-shadow duration-200"
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

            {/* Trending Badge */}
            {isTrending && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                🔥 Trending
              </div>
            )}

            {/* Retention Badge */}
            <div
              className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded shadow-lg ${retentionColor}`}
            >
              {retentionLabel}
            </div>

            {/* View Count */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <EyeIcon className="w-3 h-3" />
              {formatViews(clip.view_count)}
            </div>

            {/* Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 rounded-full p-3 text-white text-lg font-bold">
                ▶
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
