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
<div>Test</div>
          </>
  )
}

export default Page
