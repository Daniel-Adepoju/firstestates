"use client"

import { PlusCircle, MoreHorizontal } from "lucide-react"
import { CldImage } from "next-cloudinary"
import AddResident, { DeleteResident } from "../agent/ResidentFunctions"
import { truncateText } from "@utils/truncateText"

const InhabitantsSection = ({ session, listingId, inhabitantsQuery, backdrop, setBackdrop }: any) => {
  const { data, isLoading } = inhabitantsQuery

  return (
    <div className="w-full flex flex-col items-center pb-2">
      <h2 className="heading">Current Residents</h2>

      <div className="w-full flex flex-col items-center gap-2 px-3">
        {isLoading ? (
          <MoreHorizontal size={20} className="dark:text-white text-gray-600 animate-pulse" />
        ) : data?.pages?.[0]?.inhabitants?.length > 0 ? (
          <div className="w-[98%] scrollable-2 overflow-x-auto grid grid-flow-col auto-cols-[30px] gap-7">
            {data.pages.flatMap((page: any) =>
              page.inhabitants.map((inhabitant: any) => (
                <div className="flex flex-col items-center gap-1 mt-3 py-2.5 relative" key={inhabitant._id}>
                  <DeleteResident inhabitantId={inhabitant._id} className="absolute -top-1 -right-2" />
                  <CldImage src={inhabitant.user.profilePic} width={30} height={30} alt="inhabitant pic" className="rounded-full" />
                  <div className="text-xs">{truncateText(inhabitant.user.username, 12)}</div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="py-2 text-sm text-gray-600 dark:text-gray-200 text-center">No Resident</div>
        )}

        <div className="mx-auto flex flex-col items-center gap-1">
          <PlusCircle size={40} onClick={() => setBackdrop({ isOptionsOpen: !backdrop.isOptionsOpen })} className="dark:text-white text-gray-600 smallScale cursor-pointer" />
          <span className="text-sm text-gray-600 dark:text-gray-200">Add Resident</span>
        </div>

        {backdrop.isOptionsOpen && <AddResident isActive={backdrop.isOptionsOpen} listingId={listingId} />}
      </div>
    </div>
  )
}

export default InhabitantsSection
