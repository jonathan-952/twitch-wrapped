import { EyeIcon, ClockIcon } from "@/components/icons"
import { StreamersData } from "@/page"
import {Clip} from '@/client-components/clips-view'

interface ClipCardProps {
  clip: Clip
  streamer: StreamersData
}

function formatViews(views: number): string {
  console.log(views)
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return `${Math.floor(diffDays / 7)}w ago`
}

export function ClipCard({ clip, streamer }: ClipCardProps) {
  console.log(clip)
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-md bg-card mb-2 aspect-video">
        <img
        //   src={clip.thumbnail || "/placeholder.svg"}
          alt={clip.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/90 px-1.5 py-0.5 rounded text-xs font-semibold text-foreground">
          <ClockIcon className="h-3 w-3" />
          {formatDuration(clip.duration)}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {clip.title}
        </h3>

        <p className="text-sm text-muted-foreground">{streamer.BroadcasterName}</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <EyeIcon className="h-3 w-3" />
            {formatViews(clip.view_count)}
          </span>
          <span>{formatRelativeTime(clip.created_at)}</span>
        </div>
      </div>
    </div>
  )
}