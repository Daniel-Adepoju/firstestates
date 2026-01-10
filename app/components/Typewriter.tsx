"use client"

import { useEffect, useState } from "react"

interface TypewriterProps {
  text: string
  typingSpeed?: number // ms per character while typing
  deletingSpeed?: number // ms per character while deleting
  waitTime?: number // ms to wait after typing is complete
  className?: string
}

export default function Typewriter({
  text,
  typingSpeed = 32,
  deletingSpeed = 10,
  waitTime = 4000,
  className,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayedText.length < text.length) {
      // Typing forward
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, typingSpeed)
    } else if (!isDeleting && displayedText.length === text.length) {
      // Wait before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, waitTime)
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting backward
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length - 1))
      }, deletingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, text, typingSpeed, deletingSpeed, waitTime])

  return (
    <span
      className={`${className} w-[98%] mx-auto flex items-center justify-center font-header font-medium 
    text-sm  text-gray-500 dark:text-gray-400`}
    >
      {displayedText}
      {/* {text} */}
    </span>
  )
}
