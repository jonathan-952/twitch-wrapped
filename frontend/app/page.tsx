"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/client-components/navbar"
import { StreamersSidebar } from "@/client-components/streamers-sidebar"
import { ClipsView } from "@/client-components/clips-view"
import axios, {AxiosError} from "axios"
import { useRouter } from "next/navigation"

export interface StreamersData {
    broadcaster_id:    string
    broadcaser_login: string
    broadcaster_name:  string 
    followed_at:       string 
}

export default function DashboardPage() {
  const [selectedStreamer, setSelectedStreamer] = useState<StreamersData | null>(null)
  const [streamers, setStreamers] = useState<StreamersData[]>([])
  const [self, setSelf] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const getFollowers = (async() => {
      try {
        const res = await axios.get("http://localhost:8080/following", 
        {withCredentials: true}
        )
        setStreamers(res.data.follows)
        setSelf(res.data.self)
      } catch (err) {
        console.log(err)
        const error = err as AxiosError;
                console.log(err);
                if (error.response?.status === 401) {
                  router.push('/auth')
                }
      }
    })
    getFollowers()
  },[])

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
        <main className="flex-1 ml-64">
          {selectedStreamer && 
          <ClipsView streamer={selectedStreamer} />
          }
          
        </main>
      </div>
    </div>
  )
}
