"use client"

import { cn } from "@/lib/utils"
import { StreamersData } from "@/page"

interface StreamersSidebarProps {
  streamers: StreamersData[]
  selectedStreamer: StreamersData | null
  selfID: string
  onSelectStreamer: (streamer: StreamersData) => void
}

export function StreamersSidebar({
  streamers,
  selectedStreamer,
  selfID,
  onSelectStreamer,
}: StreamersSidebarProps) {
  const selfStreamer: StreamersData = {
    broadcaster_id: selfID,
    broadcaser_login: "(you)",
    broadcaster_name: "My Channel",
    followed_at: "", // unused for your own channel
  }

  const itemBase =
    "group relative w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 text-sm"
  const itemIdle =
    "text-sidebar-foreground hover:bg-sidebar-accent/40 hover:translate-x-[1px]"
  const itemActive =
    "bg-sidebar-accent text-sidebar-accent-foreground"

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* ─── Your Channel Section ───────────────────────── */}
        <div>
          <h2 className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Your Channel
          </h2>
          <button
            onClick={() => onSelectStreamer(selfStreamer)}
            className={cn(
              itemBase,
              selectedStreamer?.broadcaster_id === selfID
                ? itemActive
                : itemIdle
            )}
          >
            {/* active indicator */}
            <span
              className={cn(
                "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-sidebar-primary transition-opacity",
                selectedStreamer?.broadcaster_id === selfID
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-60"
              )}
            />
            <span className="truncate cursor-pointer">My Channel</span>
          </button>
        </div>

        <div className="h-px bg-sidebar-border" />

        {/* ─── Followed Channels Section ─────────────────── */}
        <div>
          <h2 className="mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Followed Channels
          </h2>
          <div className="space-y-0.5">
            {streamers.map((streamer, index) => {
              const isActive =
                selectedStreamer?.broadcaster_id === streamer.broadcaster_id

              return (
                <button
                  key={index}
                  onClick={() => onSelectStreamer(streamer)}
                  className={cn(itemBase, isActive ? itemActive : itemIdle)}
                >
                  {/* hover / active indicator */}
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-sidebar-primary transition-opacity",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60 "
                    )}
                  />
                  <span className="truncate cursor-pointer">{streamer.broadcaster_name}</span>
                </button>
              )}
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
