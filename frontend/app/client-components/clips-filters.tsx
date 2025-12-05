"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import { Calendar } from "@/components/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { parseISO, format } from "date-fns";
import { Clip } from "./clips-view"

export interface ClipParams {
  date_filter: string
}
interface ClipsFiltersProps {
  params: (params: ClipParams) => void
}

export function GroupClipsByDay(clips: Clip[]) {
  const sorted = [...clips].sort(
    (a, b) => parseISO(a.created_at).getTime() - parseISO(b.created_at).getTime()
  );

  const groups = sorted.reduce((acc: Record<string, Clip[]>, clip) => {
    const day = format(parseISO(clip.created_at), "yyyy-MM-dd");
    if (!acc[day]) acc[day] = [];
    acc[day].push(clip);
    return acc;
  }, {});

  return groups;
}

export function ClipsFilters({params}: ClipsFiltersProps) {
  const [date, setDate] = useState<string>("24hr")

  useEffect(() => {
    if (!date) {
      return
    }

    params({
      date_filter: date
    })
  }, [date])

  return (
     <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg">
    <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Date Filter:</span>
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

      <Button variant="outline" size="sm" className="ml-auto bg-transparent" 
      onClick={() => {
        setDate("")
      }}>
        Clear Filters
      </Button>
    </div>
  )
}
 

      {/* // <div className="flex items-center gap-2"> */}
      {/* //   <span className="text-sm font-medium text-foreground">From:</span> */}
      //   <Popover>
      //     <PopoverTrigger asChild>
      {/* //       <Button */}
      //         variant="outline"
      //         className={cn("w-[160px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
      //       >
      //         <CalendarIcon className="mr-2 h-4 w-4" />
      //         {fromDate ? format(fromDate, "MMM dd, yyyy") : "Select date"}
      //       </Button>
      //     </PopoverTrigger>
      //     <PopoverContent className="w-auto p-0" align="start">
      //       <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
      //     </PopoverContent>
      //   </Popover>
      // </div>

      // <div className="flex items-center gap-2">
      //   <span className="text-sm font-medium text-foreground">To:</span>
      //   <Popover>
      //     <PopoverTrigger asChild>
      //       <Button
      //         variant="outline"
      //         className={cn("w-[160px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}
      //       >
      //         <CalendarIcon className="mr-2 h-4 w-4" />
      //         {toDate ? format(toDate, "MMM dd, yyyy") : "Select date"}
      //       </Button>
      //     </PopoverTrigger>
      //     <PopoverContent className="w-auto p-0" align="start">
      //       <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
      //     </PopoverContent>
      //   </Popover>
      // </div>
