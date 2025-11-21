"use client"

import Link from "next/link"
import { PlusCircle, HousePlus, MoreHorizontal } from "lucide-react"

export default function ListingActions({ showAdd, session }:any) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 lg:gap-18 items-center justify-center my-3 pb-4 text-foreground">
      {showAdd ? (
        <Link
          href={"/agent/listings/add/types"}
          className="flex items-center justify-center gap-3 dark:text-white dark:bg-[#31363F] border-[1.38px] border-gray-300 dark:border-gray-500 p-3 rounded-2xl w-64 shadow-xs mediumScale"
        >
          <PlusCircle
            size={40}
            className="text-[#f29829] rounded-full animate-glass"
          />
          <span className="font-head text-gray-600 dark:text-gray-200">Add New Listing</span>
        </Link>
      ) : (
        <MoreHorizontal
          size={36}
          className="animate-pulse text-gray-500 dark:text-white"
        />
      )}

      {(!session?.user.tierOne || session?.user.tierTwo) && (
        <Link
          href="/agent/listings/residents"
          className="flex items-center justify-center gap-3 dark:text-white dark:bg-[#31363F] border-[1.38px] border-gray-300 dark:border-gray-500 p-3 rounded-2xl w-64 shadow-xs mediumScale"
        >
          <HousePlus
            size={40}
            className="text-[#f29829]  rounded-full animate-glass"
          />
          <span className="font-head text-gray-600 dark:text-gray-200">Manage Residents</span>
        </Link>
      )}
    </div>
  )
}
