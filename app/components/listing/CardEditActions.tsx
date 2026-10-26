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
      <div className="listing-edit-actions text-sm font-medium">
        {listing?.status === "pending" && isAdmin && (
          <button onClick={approveListing} aria-label="Approve listing" title="Approve listing" className="flex items-center justify-center gap-2">
            <span>Approve</span>
            <Check
              size={20}
              className="w-6 h-6 text-emerald-400"
            />
          </button>
        )}
        {listing?.status === "pending" && !isAdmin && (
          <span className="px-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-300">
            Can't perform an action yet
          </span>
        )}

        {(isAdmin || listing?.status !== "pending" ) && (
          <>
            <div
              onClick={() => router.push(`/agent/listings/edit?id=${listing?._id}`)}
              role="button" tabIndex={0} aria-label="Edit listing" title="Edit listing"
              className="cursor-pointer"
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

            <div
              role="button"
              tabIndex={0}
              aria-label="Delete listing"
              title="Delete listing"
              onClick={() => {
                if (!deleting) openDialog()
              }}
              onKeyDown={(event) => {
                if (!deleting && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault()
                  openDialog()
                }
              }}
              className="cursor-pointer"
            >
              {deleting ? (
                <LoaderPinwheel
                  size={30}
                  color="darkred"
                  className="animate-spin"
                />
              ) : (
                <Trash2
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
