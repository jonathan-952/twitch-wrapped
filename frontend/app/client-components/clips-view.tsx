"use client"

import { StreamersData } from "@/page"
import { useEffect, useState } from "react"
import { ClipsFilters } from "@/client-components/clips-filters"
import { ClipCard } from "@/client-components/clip-card"
import axios from "axios"

export interface Clip {
	url: string 
	title: string 
	view_count: number
	created_at: string 
  duration: number
	thumbnail_url: string
}

interface ClipsViewProps {
  streamer: StreamersData
}

export function ClipsView({ streamer }: ClipsViewProps) {
  const [clips, setClips] = useState<Clip[]>([])

  // pass in params: streamer id, time window, popularity
  useEffect(() => {
    const fetchClips = (async () => {
      try {
      const res = await axios.get('http://localhost:8080/get_clips', {
        withCredentials: true, 
        params: {broadcaster_id: streamer.broadcaster_id}
      })
      setClips(res.data.clips)
      } catch (err) {
        console.log(err)
      }
    })
    fetchClips()
  }, [streamer.broadcaster_id])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">{streamer.broadcaster_name}'s Clips</h2>
        <p className="text-sm text-muted-foreground">Catch up on trending moments</p>
      </div>

      <ClipsFilters />
      { clips.length > 0 &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {clips.map((clip, index) => (
            <ClipCard key={index} clip={clip} streamer={streamer} />
          ))}
        </div>
      }
    </div>
  )
}
