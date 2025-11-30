"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/client-components/navbar"
import { ClipsView } from "@/client-components/clips-view"
import axios from "axios"

export interface StreamersData {
    broadcaster_id:    string
    broadcaser_login: string
    broadcaster_name:  string 
    followed_at:       string 
}

export default function DashboardPage() {
  const [selectedStreamer, setSelectedStreamer] = useState<StreamersData | null>(null)

  useEffect(() => {
  },[])

  const handleClick = (streamer: StreamersData) => {
    setSelectedStreamer(streamer)
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {/* <StreamersSidebar
          streamers={streamers}
          selectedStreamer={selectedStreamer}
          onSelectStreamer={handleClick}
        /> */}
        <main className="flex-1 ml-64">

          <ClipsView />
        
        </main>
      </div>
    </div>
  )
}
