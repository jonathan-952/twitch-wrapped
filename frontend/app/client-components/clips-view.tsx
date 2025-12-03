"use client";

import { StreamersData } from "@/page";
import { useEffect, useState } from "react";
import {
  ClipsFilters,
  GroupClipsByDay,
} from "@/client-components/clips-filters";
import { ClipCard } from "@/client-components/clip-card";
import axios from "axios";
import { ClipParams } from "@/client-components/clips-filters";
import { useMemo } from "react";
import { parseISO, format } from "date-fns";

export interface Clip {
  url: string;
  title: string;
  view_count: number;
  created_at: string;
  duration: number;
  thumbnail_url: string;
  embed_url: string;
  TrendingScore: number;
  Retention: string;
}

export function ClipsView() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [clipParams, setClipParams] = useState<ClipParams | null>(null);


  const grouped = useMemo(() => {
  // Make a fresh grouped object every time `clips` changes
  const baseGroups = GroupClipsByDay(clips);
  
  const sortedGroups: Record<string, Clip[]> = {};

  Object.keys(baseGroups).forEach((day) => {
    const clipsForDay = baseGroups[day];

    sortedGroups[day] = [...clipsForDay].sort(
      (a, b) => b.view_count - a.view_count
    );
  });

  return sortedGroups;
}, [clips]);

  // sorted list of days (latest first)
  const days = useMemo(() => Object.keys(grouped).sort().reverse(), [grouped]);

  // pass in params: streamer id, time window, popularity
  useEffect(() => {
    console.log(clipParams);
    const fetchClips = async () => {
      try {
        const res = await axios.get("http://localhost:8080/get_clips", {
          withCredentials: true,
          params: {
            date_filter: clipParams?.date_filter,
          },
        });
        
        setClips(res.data.clips);
      } catch (err) {
        console.log(err);
      }
    };
    fetchClips();
  }, [clipParams?.date_filter]);

  const handleClipParams = async (params: ClipParams) => {
    setClipParams(params);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Your Clips</h2>
        <p className="text-sm text-muted-foreground">
          Catch up on trending moments
        </p>
      </div>

      <ClipsFilters params={handleClipParams} />
      {days.map((day) => (
        <section key={day} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {format(parseISO(day), "EEEE, MMM d")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grouped[day].map((clip, index) => (
              <ClipCard key={index} clip={clip} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
