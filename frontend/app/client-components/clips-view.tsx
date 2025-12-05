"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { parseISO, format } from "date-fns";

import {
  ClipsFilters,
  GroupClipsByDay,
} from "@/client-components/clips-filters";
import { ClipCard } from "@/client-components/clip-card";
import { ClipParams } from "@/client-components/clips-filters";
import { StreamersData } from "@/page";

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

export function ClipsView({streamer}: {streamer: StreamersData}) {
  const [clips, setClips] = useState<Clip[]>([]);
  const [clipParams, setClipParams] = useState<ClipParams | null>({date_filter: "24hr"});

  // NEW — make a per-day limit state
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    {}
  );

  const grouped = useMemo(() => {
    const baseGroups = GroupClipsByDay(clips);
    const sortedGroups: Record<string, Clip[]> = {};

    Object.keys(baseGroups).forEach((day) => {
      sortedGroups[day] = [...baseGroups[day]].sort(
        (a, b) => b.view_count - a.view_count
      );
    });

    return sortedGroups;
  }, [clips]);

  // sorted list of days (latest first)
  const days = useMemo(
    () => Object.keys(grouped).sort().reverse(),
    [grouped]
  );

  // Fetch clips when filter changes
  useEffect(() => {
    const fetchClips = async () => {
      try {
        const res = await axios.get("http://localhost:8080/get_clips", {
          withCredentials: true,
          params: {
            date_filter: clipParams?.date_filter,
            broadcaster_id: streamer.broadcaster_id
          },
        });

        setClips(res.data.clips);

        // Reset visible count when new data arrives
        const newCounts: Record<string, number> = {};
        const newGrouped = GroupClipsByDay(res.data.clips);

        Object.keys(newGrouped).forEach((day) => {
          newCounts[day] = 3; // show first 10 by default
        });

        setVisibleCounts(newCounts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchClips();
  }, [clipParams?.date_filter, streamer]);

  // Handle child filter updates
  const handleClipParams = (params: ClipParams) => {
    setClipParams(params);
  };

  // "View More" action per group
  const handleViewMore = (day: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [day]: prev[day] + 9, // reveal 10 more
    }));
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

      {days.map((day) => {
        const clipsForDay = grouped[day] || [];
        const visible = visibleCounts[day] || 9;

        return (
          <section key={day} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              {format(parseISO(day), "EEEE, MMM d")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clipsForDay.slice(0, visible).map((clip, index) => (
                <ClipCard key={index} clip={clip} />
              ))}
            </div>

            {/* Show "View More" if there are still hidden clips */}
            {visible < clipsForDay.length && (
              <button
                onClick={() => handleViewMore(day)}
                className="mt-3 text-sm text-blue-500 hover:underline"
              >
                View More
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}