import { PlusCircle, MoreHorizontal } from "lucide-react"
import { CldImage } from "next-cloudinary"
import AddResident, { DeleteResident } from "../agent/ResidentFunctions"
import { truncateText } from "@utils/truncateText"

const InhabitantsSection = ({
  session,
  listingId,
  inhabitantsQuery,
  backdrop,
  setBackdrop,
}: any) => {
  const { data, isLoading } = inhabitantsQuery

  if (
    session?.user?.id !== undefined &&
    session?.user?.id === data?.pages?.[0]?.inhabitants?.[0]?.listing?.agent &&
    session?.user.isPremium
  ) {

  return (
    <div className="w-full flex flex-col items-center pb-2 relative">
      {backdrop.isOptionsOpen && <AddResident listingId={listingId} />}
      <h2 className="heading">Current Residents</h2>
      {isLoading ? (
        <MoreHorizontal
          size={20}
          className="animate-pulse dark:text-white text-gray-600"
        />
      ) : data?.pages[0].inhabitants.length > 0 ? (
        <div className="w-full scrollable-2 overflow-x-auto grid grid-flow-col auto-cols-[30px] gap-7">
          {data.pages.flatMap((page: any) =>
            page.inhabitants.map((inhabitant: any) => (
              <div
                key={inhabitant._id}
                className="flex flex-col items-center gap-1 mt-3 py-2.5 relative"
              >
                <DeleteResident
                  inhabitantId={inhabitant._id}
                  className="absolute -top-1 -right-2"
                />
                <CldImage
                  src={inhabitant.user.profilePic}
                  width={30}
                  height={30}
                  crop={'auto'}
                  alt="inhabitant pic"
                  className="rounded-full"
                />
                <div className="text-xs w-full">{truncateText(inhabitant.user.username, 8)}</div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="text-gray-600 dark:text-gray-200 py-2 text-sm">No Resident</div>
      )}

      <div className="flex flex-col items-center gap-1 mt-2">
        <PlusCircle
          size={40}
          onClick={() => setBackdrop({ isOptionsOpen: !backdrop.isOptionsOpen })}
          className="cursor-pointer dark:text-white text-gray-600"
        />
        <span className="text-sm text-gray-600 dark:text-gray-200">Add Resident</span>
      </div>
    </div>
  )
}

  return null
}

export default InhabitantsSection
