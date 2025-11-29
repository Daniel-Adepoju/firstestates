"use client"
import { MessageSquare } from "lucide-react"

export default function ChatLoading() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-[70vh]">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-goldPrimary rounded-xl flex items-center justify-center shadow-lg dark:shadow-black
          bounce-y ">
          <MessageSquare className="text-white" size={22} />
        </div>
      </div>

 
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-500 dark:bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-gray-500 dark:bg-gray-300 rounded-full animate-pulse delay-150"></div>
        <div className="w-3 h-3 bg-gray-500 dark:bg-gray-300 rounded-full animate-pulse delay-300"></div>
      </div>

      <p className="w-80 font-head mx-auto text-center text-gray-500 dark:text-gray-300 mt-3 text-sm md:text-md">
        Loading ...
      </p>
    </div>
  )
}
