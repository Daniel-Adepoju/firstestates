"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@components/ui/button"
import { Calendar } from "@components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover"

export function DatePicker({
  className,
  date,
  setDate,
  placeholder = "Pick a date"
}: {
    placeholder?:string
  className?: string
  date?: Date
  setDate: (date: any) => void
}) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={`${className} data-[empty=true]:text-muted-foreground justify-start text-left font-normal `}
        >
          <CalendarIcon />
          {date ? (date && format(date, "PPP") ) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-900">
        <Calendar required mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}