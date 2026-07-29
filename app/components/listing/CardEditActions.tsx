import { EditIcon, Trash2, LoaderPinwheel, Check } from "lucide-react"
import { DeleteModal } from "../Modals"
import { FeaturedBtn } from "./Featured"

const CardEditActions = ({
  listing,
  deleting,
  setDeleting,
  openDialog,
  deleteRef,
  router,
  isAdmin,
  approveListing,
}: any) => {
  return (
    <>
      {/* edit buttons */}
      <div className="editSid w-[82%] text-sm font-medium md:w-[88%] h-18 flex items-center justify-evenly bg-white dark:bg-darkGray rounded-xl mt-[-34px] md:mt-[-20px] outline-2 outline-gray-100 dark:outline-black/20">
        {listing?.status === "pending" && isAdmin && (
          <button
          onClick={approveListing}
          className="w-[60%] flex items-center justify-center gap-2
           dark:bg-darkGray/40 bg-white/80 p-3 gloss shadow-sm dark:shadow-black rounded-xl">
            <span> Approve</span>
            <Check
              size={20}
              className="w-6 h-6 text-emerald-400"
            />
          </button>
        )}
        {listing?.status === "pending" && !isAdmin && `Can't perform an action yet`}

        {(isAdmin || listing?.status !== "pending" ) && (
          <>
            <div
              onClick={() => router.push(`/agent/listings/edit?id=${listing?._id}`)}
              className="dark:bg-darkGray/20 bg-white/80 w-10 h-10 flex flex-row items-center justify-center rounded-full shadow-md dark:shadow-black/30 gloss hover:scale-99 ease-out duration-100 transition-transform cursor-pointer"
            >
              <EditIcon
                size={30}
                className="text-emerald-800 dark:text-emerald-600"
              />
            </div>

            {listing?.listingTier === "gold" && (
              <FeaturedBtn
                listingId={listing?._id}
                isFeatured={listing?.isFeatured}
                createdDate={listing.createdAt}
              />
            )}

            <div className="dark:bg-darkGray/20 bg-white/80 w-10 h-10 flex flex-row items-center justify-center rounded-full shadow-md dark:shadow-black/30 gloss hover:scale-99 ease-out duration-100 transition-transform cursor-pointer">
              {deleting ? (
                <LoaderPinwheel
                  size={30}
                  color="darkred"
                  className="animate-spin"
                />
              ) : (
                <Trash2
                  onClick={openDialog}
                  size={30}
                  className="text-red-800 dark:text-red-600"
                />
              )}
            </div>

            <DeleteModal
              ref={deleteRef}
              setDeleting={setDeleting}
              listingId={listing?._id ?? ""}
            />
          </>
        )}
      </div>
    </>
  )
}

export default CardEditActions
