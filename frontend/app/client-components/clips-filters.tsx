"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select"

import { parseISO, format } from "date-fns"
import { Clip } from "@/client-components/clips-view"

export interface ClipParams {
  date_filter: string
  trendingOnly?: boolean
  growingOnly?: boolean
}

interface ClipsFiltersProps {
  params: (params: ClipParams) => void
}

export function ClipsFilters({ params }: ClipsFiltersProps) {
  const [date, setDate] = useState("24hr")
  const [trendingOnly, setTrendingOnly] = useState(false)
  const [growingOnly, setGrowingOnly] = useState(false)

  useEffect(() => {
    params({
      date_filter: date,
      trendingOnly,
      growingOnly,
    })
  }, [date, trendingOnly, growingOnly])

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card border border-border rounded-lg">
      {/* Date filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Date</span>
        <Select value={date} onValueChange={setDate}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24hr">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="6 months">Bi-Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trending toggle */}
      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={trendingOnly}
          onChange={(e) => setTrendingOnly(e.target.checked)}
          className="accent-red-500"
        />
        🔥 Trending
      </label>

      {/* Growing toggle */}
      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={growingOnly}
          onChange={(e) => setGrowingOnly(e.target.checked)}
          className="accent-emerald-500"
        />
        📈 Growing
      </label>

      {/* Clear */}
      <Button
        variant="outline"
        size="sm"
        className="ml-auto"
        onClick={() => {
          setDate("24hr")
          setTrendingOnly(false)
          setGrowingOnly(false)
        }}
      >
        Clear
      </Button>
    </div>
  )
}

export function GroupClipsByDay(clips: Clip[]) {
  const sorted = [...clips].sort(
    (a, b) =>
      parseISO(a.created_at).getTime() -
      parseISO(b.created_at).getTime()
  )

  return sorted.reduce((acc: Record<string, Clip[]>, clip) => {
    const day = format(parseISO(clip.created_at), "yyyy-MM-dd")
    if (!acc[day]) acc[day] = []
    acc[day].push(clip)
    return acc
  }, {})
}