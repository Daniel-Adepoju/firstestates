"use client"

import { Flag, ScanSearch, HeartPlus, TriangleAlert } from "lucide-react"

const UserOptions = ({ session, listing, router, onReport, onWishlist }: any) => {
  if (session?.user?.role === "admin") {
    return (
      <div id="adminOptions" className="flex flex-col items-center w-full text-gray-500 dark:text-gray-300 text-xs text-center font-medium">
        You have admin priviledges, you can view reports and delete this listing
        <div
          onClick={() => router.push(`/admin/listings/${listing._id}`)}
          className="mt-2 smallScale text-md font-extrabold rounded-md p-2 px-10 bg-gray-300/50 dark:bg-gray-500/40 report cursor-pointer flex flex-row items-center gap-2"
        >
          <ScanSearch size={24} color="green" />
          <span className="text-gray-600 dark:text-gray-200">Investigate Listing</span>
        </div>
      </div>
    )
  }

  if (session?.user?.id === listing?.agent?._id) {
    return <div className="text-gray-500 dark:text-gray-400 text-sm">You are the owner of this listing</div>
  }

  if (session?.user && session?.user?.role === "client") {
    return (
      <>
        <div onClick={onReport} id="clientReport" className="mt-2 w-60 smallScale rounded-md p-2 px-4 bg-gray-300/50 dark:bg-gray-500/40 cursor-pointer flex items-center justify-center gap-2">
          <Flag size={20} className="text-red-700" />
          <span className="text-md font-extrabold">Report this listing</span>
        </div>
        <div onClick={onWishlist} className="w-60 smallScale rounded-md p-2 px-4 bg-gray-300/50 dark:bg-gray-500/40 cursor-pointer flex items-center justify-center gap-2">
          <HeartPlus size={20} className="text-red-700 animate-pulse" />
          <span className="text-md font-extrabold">Add to wishlist</span>
        </div>
      </>
    )
  }

  return (
    <div className="flex items-center">
      <TriangleAlert size={20} className="text-red-700 mr-2 mt-1" />
      <span className="text-sm">
      Log in to report listing
    </span> 
    </div>
   
  )
}

export default UserOptions
