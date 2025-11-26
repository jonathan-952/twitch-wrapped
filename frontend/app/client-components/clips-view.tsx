"use client"

import { useState } from "react"
// import { ClipsFilters } from "@/components/clips-filters"
// import { ClipCard } from "@/components/clip-card"

interface Streamer {
  id: string
  name: string
  avatar: string
  isLive: boolean
}

interface ClipsViewProps {
  streamer: Streamer
}

// Mock clips data
const MOCK_CLIPS = [
  {
    id: "1",
    title: "Insane 1v5 Clutch!",
    thumbnail: "/gaming-clutch.jpg",
    views: 145000,
    createdAt: "2024-01-20T10:30:00Z",
    duration: 42,
    game: "Valorant",
  },
  {
    id: "2",
    title: "Funniest Moment of the Stream",
    thumbnail: "/funny-moment.jpg",
    views: 89000,
    createdAt: "2024-01-19T15:45:00Z",
    duration: 28,
    game: "Just Chatting",
  },
  {
    id: "3",
    title: "Epic Headshot Compilation",
    thumbnail: "/professional-headshot.png",
    views: 234000,
    createdAt: "2024-01-18T20:15:00Z",
    duration: 55,
    game: "Counter-Strike 2",
  },
  {
    id: "4",
    title: "Chat Loses Their Mind",
    thumbnail: "/streamer-reaction.jpg",
    views: 67000,
    createdAt: "2024-01-17T12:00:00Z",
    duration: 35,
    game: "League of Legends",
  },
]

// export function ClipsView({ streamer }: ClipsViewProps) {
//   const [clips] = useState(MOCK_CLIPS)

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-foreground mb-1">{streamer.name}'s Clips</h2>
//         <p className="text-sm text-muted-foreground">Catch up on trending moments</p>
//       </div>

//       <ClipsFilters />

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
//         {clips.map((clip) => (
//           <ClipCard key={clip.id} clip={clip} streamer={streamer} />
//         ))}
//       </div>
//     </div>
//   )
// }