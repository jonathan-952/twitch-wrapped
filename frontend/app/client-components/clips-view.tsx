"use client"

import { useEffect, useState, useMemo } from "react"
import axios, { AxiosError } from "axios"
import { parseISO, format } from "date-fns"
import { useRouter } from "next/navigation"

import { ClipParams, GroupClipsByDay } from "@/client-components/clips-filters"
import { ClipCard } from "@/client-components/clip-card"
import { StreamersData } from "@/page"

export interface Clip {
  url: string
  title: string
  view_count: number
  created_at: string
  duration: number
  thumbnail_url: string
  embed_url: string
  TrendingScore: number
  Retention: string
}

export function ClipsView({
  streamer,
  clipParams,
}: {
  streamer: StreamersData
  clipParams: ClipParams
}) {
  const [clips, setClips] = useState<Clip[]>([])
  const router = useRouter()
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({})

  // Filtering and grouping remain the same
  const filteredClips = useMemo(() => {
    return clips.filter((clip) => {
      if (clipParams.trendingOnly && clip.TrendingScore <= 10) return false
      if (clipParams.growingOnly && !clip.Retention) return false
      return true
    })
  }, [clips, clipParams])

  const grouped = useMemo(() => {
    const baseGroups = GroupClipsByDay(filteredClips)
    const sortedGroups: Record<string, Clip[]> = {}
    Object.keys(baseGroups).forEach((day) => {
      sortedGroups[day] = [...baseGroups[day]].sort(
        (a, b) => b.view_count - a.view_count
      )
    })
    return sortedGroups
  }, [filteredClips])

  const days = useMemo(() => Object.keys(grouped).sort().reverse(), [grouped])

  useEffect(() => {
    const fetchClips = async () => {
      try {
        const res = await axios.get("http://localhost:8080/get_clips", {
          withCredentials: true,
          params: {
            date_filter: clipParams.date_filter,
            broadcaster_id: streamer.broadcaster_id,
          },
        })
        setClips(res.data.clips)

        const newCounts: Record<string, number> = {}
        const grouped = GroupClipsByDay(res.data.clips)
        Object.keys(grouped).forEach((day) => (newCounts[day] = 9))
        setVisibleCounts(newCounts)
      } catch (err) {
        const error = err as AxiosError
        if (error.response?.status === 401) router.push("/auth")
      }
    }

    fetchClips()
  }, [clipParams.date_filter, streamer, router])

  const handleViewMore = (day: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [day]: prev[day] + 9,
    }))
  }

  return (
    <div className="mt-6">
      {days.map((day) => {
        const clipsForDay = grouped[day] || []
        const visible = visibleCounts[day] || 9

        return (
          <section key={day} className="mb-8">
            <h2 className="text-lg font-semibold mb-3">
              {format(parseISO(day), "EEEE, MMM d")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clipsForDay.slice(0, visible).map((clip, index) => (
                <ClipCard key={index} clip={clip} />
              ))}
            </div>

            {visible < clipsForDay.length && (
              <button
                onClick={() => handleViewMore(day)}
                className="mt-4 text-sm text-primary hover:underline"
              >
                View More
              </button>
            )}
          </section>
        )
      })}

      {days.length === 0 && (
        <p className="text-sm text-muted-foreground mt-6">
          No clips match your filters.
        </p>
      )}
    </div>
  )
}
