"use client"

import { useSignal } from "@preact/signals-react/runtime"
// import { useNotification } from "@components/Notification"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar } from "@components/ui/calendar"
import { parseDate, createdAt } from "@utils/date"
const Page = () => {
  const [date,setDate] = useState<Date | undefined>(undefined)
  const [mounted,setMounted] = useState(false)

 useEffect(() => {
    setMounted(true)
    setDate(new Date())
  }, [])

 console.log(date)

if(!mounted) return null

  return (
    <>

      <div className="flex flex-col items-center  mt-45 mx-auto w-full">
   
    <Calendar 
    mode="single"
    defaultMonth={date}
    selected={date}
    onSelect={setDate}
    captionLayout="dropdown"
    className="dark:bg-darkGray bg-white shadow-md "
    classNames={{
    day: "rounded-md p-1 md:p-2 mx-[2px] my-[2px] hover:bg-muted", // add spacing
  }}
    />

    <div>
      {createdAt(date).includes('ago') ?
      <span>You had an appointment {createdAt(date)}</span>
      :  <span>You have an appointment {createdAt(date)}</span> }
      </div>
         </div>
          </>
  )
}

export default Page
