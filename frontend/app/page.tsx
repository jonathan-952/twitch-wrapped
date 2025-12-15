"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/client-components/navbar"
import { StreamersSidebar } from "@/client-components/streamers-sidebar"
import { ClipsView } from "@/client-components/clips-view"
import { ClipsFilters, ClipParams } from "@/client-components/clips-filters"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"

export interface StreamersData {
  broadcaster_id: string
  broadcaser_login: string
  broadcaster_name: string
  followed_at: string
}

export default function DashboardPage() {
  const [selectedStreamer, setSelectedStreamer] =
    useState<StreamersData | null>(null)
  const [streamers, setStreamers] = useState<StreamersData[]>([])
  const [self, setSelf] = useState<string>("")
  const [clipParams, setClipParams] = useState<ClipParams>({
    date_filter: "24hr",
  })

  const router = useRouter()

  useEffect(() => {
    const getFollowers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_FOLLOWING}`, {
          withCredentials: true,
        })
        setStreamers(res.data.follows)
        setSelf(res.data.self)
      } catch (err) {
        const error = err as AxiosError
        if (error.response?.status === 401) {
          router.push("/auth")
        }
      }
    }

    getFollowers()
  }, [router])

  const handleClick = (streamer: StreamersData) => {
    setSelectedStreamer(streamer)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        <StreamersSidebar
          streamers={streamers}
          selectedStreamer={selectedStreamer}
          onSelectStreamer={handleClick}
          selfID={self}
        />

        <main className="flex-1 ml-64 p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Your Clips
            </h2>
            <p className="text-sm text-muted-foreground">
              Catch up on trending moments
            </p>
          </div>

          {/* Filters always visible */}
          <ClipsFilters params={setClipParams} />

          {/* Clips section */}
          {selectedStreamer ? (
            <ClipsView
              streamer={selectedStreamer}
              clipParams={clipParams}
            />
          ) : (
            <div className="mt-12 text-center text-muted-foreground">
              Select a streamer to view clips
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
