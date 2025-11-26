"use client"

import { StreamersData } from "@/page"
import { useEffect, useState } from "react"
import { ClipsFilters } from "@/client-components/clips-filters"
import { ClipCard } from "@/client-components/clip-card"
import axios from "axios"

export interface Clip {
	Url: string 
	Title: string 
	ViewCount: number
	CreatedAt: string 
  Duration: number
	Thumbnail_URL: string
}

interface ClipsViewProps {
  streamer: StreamersData
}

export function ClipsView({ streamer }: ClipsViewProps) {
  const [clips, setClips] = useState<Clip[]>([])

  // pass in params: streamer id, time window, popularity
  useEffect(() => {
    const fetchClips = (async () => {
      const res = await axios.get('http://localhost:8080/get_clips',
        {withCredentials: true}
      )
      setClips(res.data.clips)
    })
    fetchClips()

  })
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">{streamer.BroadcasterName}'s Clips</h2>
        <p className="text-sm text-muted-foreground">Catch up on trending moments</p>
      </div>

      <ClipsFilters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {clips.map((clip, index) => (
          <ClipCard key={index} clip={clip} streamer={streamer} />
        ))}
      </div>
    </div>
  )
}