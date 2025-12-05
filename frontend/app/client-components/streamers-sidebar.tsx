"use client"

import { cn } from "@/lib/utils"
import {StreamersData} from "@/page"


interface StreamersSidebarProps {
  streamers: StreamersData[]
  selectedStreamer: StreamersData | null
  selfID: string
  onSelectStreamer: (streamer: StreamersData) => void
}
export function StreamersSidebar({ streamers, selectedStreamer, selfID, onSelectStreamer }: StreamersSidebarProps) {
  const selfStreamer: StreamersData = {
    broadcaster_id: selfID,
    broadcaser_login: "(you)",
    broadcaster_name: "My Channel",
    followed_at: ""   // unused for your own channel
  }
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-4">

        {/* ─── Your Channel Section ───────────────────────── */}
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Your Channel
        </h2>
        <button
      onClick={() => onSelectStreamer(selfStreamer)}
          className={cn(
            "w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors",
            selectedStreamer?.broadcaster_id === selfID
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
          )}
        >

          My Channel
        </button>

        <div className="h-px bg-sidebar-border my-4" />


        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Followed Channels
        </h2>
        <div className="space-y-1">
          {streamers.map((streamer, index) => (
            <button
              key={index}
              onClick={() => onSelectStreamer(streamer)}
              className={cn(
                "w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors",
                selectedStreamer?.broadcaster_id === streamer.broadcaster_id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
              )}
            >
              {streamer.broadcaster_name}
            </button>
          ))}
        </div>

      </div>
    </aside>
  )
}