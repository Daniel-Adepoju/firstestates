import { CldImage } from "next-cloudinary"
import { WishlistButton } from "../WishListCard"
import { MoreHorizontal } from "lucide-react"
import { daysLeft } from "@utils/date"

const CardImage = ({
  listing,
  blankSlate,
  isAgentCard,
  isInWishList,
  backdrop,
  setBackdrop,
}: any) => {
  return (
    <>
      {/* image */}
      <div className="houseImg">
        {listing?.mainImage?.startsWith("http") ? (
          <CldImage
            fill={true}
            alt="post_img"
            src={"igy0tozve5oyjrsfmq3o"}
            crop={{ type: "auto", source: true }}
          />
        ) : (
          <CldImage
            fill={true}
            alt="post_img"
            src={listing.mainImage}
            crop={{ type: "auto", source: true }}
          />
        )}

        {/*actions ->> client */}
        {!blankSlate && !isAgentCard ? (
          <div className="flex flex-col items-center justify-center gap-1 absolute top-2 right-3 z-10">
            <WishlistButton
              isInWishList={isInWishList || false}
              listingId={listing?._id ?? ""}
            />
            <div
              onClick={(e) => {
                e.stopPropagation()
                setBackdrop({ isOptionsOpen: !backdrop.isOptionsOpen, selectedData: listing })
              }}
              className="clickable rounded-full bg-white dark:bg-gray-700 w-6.5 h-6.5 flex items-center justify-center p-0.5"
            >
              <MoreHorizontal
                size={30}
                className="text-gray-700 dark:text-white"
              />
            </div>
          </div>
        ) : (
          ""
        )}

        {/* actions ->> agent */}
        {!blankSlate && isAgentCard ? (
          <div className="flex flex-col items-end justify-end gap-1 absolute top-2 right-3 z-10">
            <div className="outline-2 outline-black/10 capitalize font-head bg-white dark:bg-gray-700 px-2 py-1 rounded-md text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm mb-1">
              <span
                className={`
                  ${listing?.listingTier === "standard" && "text-sky-500"}
                  ${listing?.listingTier === "gold" && "text-goldPrimary"} ${
                  listing?.listingTier === "first" && "text-[#b647ff]"
                }`}
              >
                {listing?.listingTier}
              </span>
            </div>
            <div className="outline-2 outline-black/10 font-list bg-white dark:bg-gray-700 px-2 py-1 rounded-md text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
              Valid for {daysLeft(listing?.validUntil)} days
              {/* <p>Created at {createdAt(listing?.createdAt)}</p> */}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  )
}

export default CardImage
