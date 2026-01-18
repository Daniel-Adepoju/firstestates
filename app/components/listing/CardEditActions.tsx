import { EditIcon, Trash2, LoaderPinwheel } from "lucide-react"
import { DeleteModal } from "../Modals"
import { FeaturedBtn } from "./Featured"

const CardEditActions = ({
  listing,
  deleting,
  setDeleting,
  openDialog,
  deleteRef,
  router,
}: any) => {
  return (
    <>
      {/* edit buttons */}
      <div className="editSid w-[82%] md:w-[88%] h-18 flex items-center justify-evenly bg-white dark:bg-darkGray rounded-xl mt-[-34px] md:mt-[-20px] outline-2 outline-gray-100 dark:outline-black/20">
        <div
          onClick={() => router.push(`/agent/listings/edit?id=${listing?._id}`)}
          className="dark:bg-darkGray/20 bg-white/80 w-10 h-10 flex flex-row items-center justify-center rounded-full shadow-md dark:shadow-black/30 gloss hover:scale-99 ease-out duration-100 transition-transform cursor-pointer"
        >
          <EditIcon size={30} className="text-green-800 dark:text-green-600" />
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
            <LoaderPinwheel size={30} color="darkred" className="animate-spin" />
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
      </div>
    </>
  )
}

export default CardEditActions
