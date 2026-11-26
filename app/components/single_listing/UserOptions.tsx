"use client"

import { ScanSearch, HeartPlus } from "lucide-react"

const UserOptions = ({ session, listing, router, onWishlist }: any) => {
  if (session?.user?.role === "admin") {
    return (
      <div
        id="adminOptions"
        className="flex flex-col items-center w-full text-gray-500 dark:text-gray-300 text-xs text-center font-medium py-4 px-2"
      >
        You have admin priviledges, you can view reports and delete this listing
        <div
          onClick={() => router.push(`/admin/listings/${listing._id}`)}
          className="mt-2 smallScale text-md font-extrabold rounded-md p-2 px-10 shadow-sm dark:shadow-black  dark:bg-darkGray report cursor-pointer flex flex-row items-center gap-2"
        >
          <ScanSearch
            size={24}
            color="green"
          />
          <span className="text-gray-600 dark:text-gray-200">Investigate Listing</span>
        </div>
      </div>
    )
  }

  if (session?.user?.id === listing?.agent?._id) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-sm">
        You are the owner of this listing
      </div>
    )
  }

  if (session?.user && session?.user?.role === "client") {
    return (
      <>
        <div
          onClick={onWishlist}
          className="w-60 smallScale rounded-md p-2 px-4 shadow-sm dark:shadow-black  dark:bg-darkGray cursor-pointer flex items-center justify-center gap-2"
        >
          <HeartPlus
            size={20}
            className="text-red-700 animate-pulse"
          />
          <span className="text-md font-extrabold">Add to wishlist</span>
        </div>
      </>
    )
  }

  return null
}

export default UserOptions
