import { CldImage } from "next-cloudinary"
import { WishlistButton } from "../WishListCard"
import { MoreHorizontal, ShieldCheck, Clock3 } from "lucide-react"
import { daysLeft } from "@utils/date"

const CardImage = ({
  listing,
  blankSlate,
  isAgentCard,
  isInWishList,
  backdrop,
  isAdminCard,
  setBackdrop,
}: any) => {
  return (
    <>
      {/* image */}
      <div className="houseImg group relative isolate">
        {listing?.mainImage?.startsWith("http") ? (
          <CldImage
            fill={true}
            alt="post_img"
            src={"igy0tozve5oyjrsfmq3o"}
            crop="auto"
            className="pointer-events-none"
          />
        ) : (
          <CldImage
            fill
            alt="Post image"
            src={listing.mainImage}
            crop="auto"
            className="pointer-events-none"
          />
        )}
        {/* client action button */}
        {!blankSlate && !(isAgentCard || isAdminCard) ? (
          <div
            className="pointer-events-auto  absolute right-2 top-3 z-20 flex items-center gap-2"
            data-card-action="true"
          >
            <WishlistButton
              isInWishList={isInWishList || false}
              listingId={listing?._id ?? ""}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setBackdrop({ isOptionsOpen: !backdrop.isOptionsOpen, selectedData: listing })
              }}
              aria-label="More listing options"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/55 text-white shadow-lg backdrop-blur-md transition hover:bg-slate-950/80 active:scale-95"
            >
              <MoreHorizontal size={22} />
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default CardImage
