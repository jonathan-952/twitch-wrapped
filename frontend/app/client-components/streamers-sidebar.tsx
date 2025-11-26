"use client"

import { cn } from "@/lib/utils"
import {StreamersData} from "@/page"


interface StreamersSidebarProps {
  streamers: StreamersData[]
  selectedStreamer: StreamersData | null
  onSelectStreamer: (streamer: StreamersData) => void
}

export function StreamersSidebar({ streamers, selectedStreamer, onSelectStreamer }: StreamersSidebarProps) {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Followed Channels</h2>
        <div className="space-y-1">
          {streamers.map((streamer, index) => (
            <button
              key={index}
              onClick={() => onSelectStreamer(streamer)}
              className={cn(
                "w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-black bg-red-50",
                selectedStreamer != null && selectedStreamer.BroadcasterID === streamer.BroadcasterID
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
              )}
            >
              {streamer.BroadcasterName}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}