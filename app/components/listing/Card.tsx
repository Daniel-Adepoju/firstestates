"use client"
import Image from "next/image"
import React, { useRef, useState } from "react"
import { CldImage } from "next-cloudinary"
import { truncateText } from "@utils/truncateText"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DeleteModal } from "../Modals"
import { useDarkMode } from "@lib/DarkModeProvider"
import {
  Toilet,
  Bed,
  Bath,
  MapPin,
  Eye,
  EditIcon,
  Trash2,
  LoaderPinwheel,
  MoreVerticalIcon,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react"
import { formatNumber } from "@utils/formatNumber"
import { FeaturedBtn } from "./Featured"
import { WishlistButton } from "../WishListCard"
import { useBackdrop } from "@lib/Backdrop"
import CardOptions from "./CardOptions"
import { daysLeft, createdAt } from "@utils/date"
import { useAnimation } from "@lib/useAnimation"

export interface CardProps {
  edit?: boolean
  isAgentCard?: boolean
  listing: Listing
  isInWishList?: boolean
  blankSlate?: boolean
}
const Card = ({ edit, listing, isAgentCard, isInWishList, blankSlate = false }: CardProps) => {
  const [address] = useState(listing?.address || "Nigeria")
  const router = useRouter()
  const deleteRef = useRef<HTMLDialogElement>(null)
  const [deleting, setDeleting] = useState(false)
  const [weeklyViews] = useState(formatNumber(listing?.weeklyViews ?? 0) || 0)
  const [totalViews] = useState(formatNumber(listing?.totalViews ?? 0) || 0)
  const [showMore, setShowMore] = useState(false)
  const { backdrop, setBackdrop } = useBackdrop()

  const openDialog = () => {
    deleteRef.current?.showModal()
  }

  const visitCard = () => {
    if (isAgentCard) {
      return router.push(`/agent/listings/single_listing?id=${listing?._id}`)
    }
    router.push(`/listings/single_listing?id=${listing?._id}`)
  }

const { ref, className: animateClass } = useAnimation({
  threshold: 0.1,
  rootMargin: "0px 0px -30px 0px",
})

  return (
    <>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`${animateClass} cardContainer`}
      >
        <div
          onClick={visitCard}
          className={`card font-card ${blankSlate && "blankSlate"} transition-all duration-200 ease-in hover:transition-all hover:duration-200 hover:ease-out`}
        >
          {/* image */}
          <div className="houseImg">
            {listing?.mainImage?.startsWith("http") ? (
              <CldImage
                fill={true}
                alt="post_img"
                src={"igy0tozve5oyjrsfmq3o"}
                crop={{
                  type: "auto",
                  source: true,
                }}
              />
            ) : (
              <CldImage
                fill={true}
                alt="post_img"
                src={listing.mainImage}
                crop={{
                  type: "auto",
                  source: true,
                }}
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

          <div className="body">
            {/* location */}
            <div className="heading location">{listing?.location}</div>

            {/* address */}
            <div className="address flex flex-row items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <MapPin
                size={24}
                className="text-goldPrimary"
              />
              {/* text-goldPrimary dark:text-bluePrimary <<- text-goldPrimary */}
              <span>{truncateText(address, 30)}</span>
            </div>

            {!edit && (
              <>
                {/* amenities */}
                <div className="home_details font-list foont-bold">
                  <div>
                    <Bed
                      size={30}
                      className="text-goldPrimary"
                    />
                    <span className="text-gray-700 dark:text-white">{listing?.bedrooms}</span>
                  </div>
                  <div>
                    <Bath
                      size={30}
                      className="text-goldPrimary"
                    />
                    <span className="text-gray-700 dark:text-white">{listing?.bathrooms}</span>
                  </div>
                  <div>
                    <Toilet
                      size={30}
                      className="text-goldPrimary"
                    />
                    <span className="text-gray-700 dark:text-white">{listing?.toilets}</span>
                  </div>
                </div>

                {/* unique to client */}
                {/* agent */}
                {!isAgentCard && (
                  <div className="flex flex-col items-center justify-center self-center font-list font-bold">
                    <div
                      className="w-full text-sm flex flex-col
        items-center justify-start gap-1
         break-words"
                    >
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={`/agent-view/${listing?.agent?._id}`}
                        className="block break-all text-start"
                      >
                        <CldImage
                          width={30}
                          height={30}
                          crop={"auto"}
                          gravity="center"
                          alt="agent pic"
                          className="my-1 rounded-full object-cover"
                          src={listing?.agent?.profilePic}
                        />
                        <div className="flex items-center gap-1">
                          <span className="quickLink">{listing?.agent?.username}</span>
                          {listing?.agent?.isTierOne && (
                            <Image
                              src={"/icons/gold-badge.svg"}
                              alt="badge"
                              width={18}
                              height={18}
                              className="rounded-full"
                            />
                          )}
                          {listing?.agent?.isTierTwo && (
                            <Image
                              src={"/icons/silver-badge.svg"}
                              alt="badge"
                              width={18}
                              height={18}
                              className="rounded-full"
                            />
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {/* unique to agents */}

                {/* views */}
                {isAgentCard && (
                  <div className="w-full flex flex-col pt-1 gap-2 pl-3 font-semibold">
                    <div className="text-gray-500 dark:text-gray-400 flex flex-row gap-3 items-center text-sm">
                      <Eye size={20} />
                      Past Week Views
                      <span className="views smallNum text-gray-700 dark:text-white">
                        {weeklyViews}
                      </span>
                    </div>

                    <div className="text-gray-500  dark:text-gray-400 flex flex-row gap-3 items-center text-sm">
                      <Eye size={20} />
                      Total Views
                      <span className="views smallNum">{totalViews}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/*more content --> listing availability status,school and price*/}
          {!edit && (
            <div className="capitalize absolute top-0 left-[1px] flex flex-col items-center justify-start justify-content-start gap-1 px-2 z-2">
              {/* school*/}
              <div
                className="self-start headersFont w-25 inline-flex item-center justify-center px-3 py-2
                bg-white dark:bg-gray-700 text-sm font-medium
                   text-gray-700 dark:text-gray-200 rounded-md"
              >
                {listing?.school}
              </div>

              {/* status */}
              <div
                className={`tag no_absolute ${
                  listing?.status === "rented" && "rented"
                } w-25 self-start px-3.5 py-2 text-sm rounded-md  headersFont`}
              >
                {listing?.status}
              </div>

              {/* price */}
              {showMore && (
                <div
                  className="animation-slide-in-top-faster self-start headersFont w-25 inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-md
                   bg-gray-50 dark:bg-gray-700 text-sm font-medium
                   text-gray-700 dark:text-gray-200 shadow-sm"
                >
                  <span className="text-sm">
                    &#8358;{formatNumber(Number(listing?.price) || 0)}
                  </span>
                </div>
              )}

              {/* co-rent and roomie requests */}
              {showMore && (
                <div
                  className={`animation-slide-in-top-fast headersFont w-full self-start inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-md
                  ${
                    listing?.status === "rented" ? "bg-[#f29829]" : "bg-green-700"
                  } text-sm font-medium
                   shadow-sm`}
                >
                  {listing?.status === "rented" ? (
                    <span className="text-sm text-white ">
                      {listing?.requestCounts.roommate} Roommate Request
                    </span>
                  ) : (
                    <span className="text-sm text-white ">
                      {listing?.requestCounts.coRent} Co-Rent Requests
                    </span>
                  )}
                </div>
              )}

              {/* showmore btn */}
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMore(!showMore)
                }}
                className="clickable bg-white dark:bg-gray-700 rounded-full self-start ml-2 p-1 h-6.5 w-6.5 flex items-center justify-center"
              >
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    showMore && "rotate-180"
                  } duration-500 text-gray-700 dark:text-white`}
                />
              </div>
            </div>
          )}
        </div>

        {/* edit buttons */}
        {edit && (
          <div className="editSid w-[82%] md:w-[88%] h-18
            flex items-center justify-evenly
             bg-white dark:bg-darkGray rounded-xl
              mt-[-34px] md:mt-[-20px]  outline-2 outline-gray-100 dark:outline-black/20
             ">
            <div
              onClick={() => router.push(`/agent/listings/edit?id=${listing?._id}`)}
   className="dark:bg-darkGray/20 bg-white/80 w-10 h-10 
          flex flex-row items-center justify-center
          rounded-full shadow-md dark:shadow-black/30
          gloss hover:scale-99 ease-out duration-100 transition-transform cursor-pointer"
            >
              <EditIcon
                size={30}
                className="text-green-800 dark:text-green-600"
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
   className="dark:bg-darkGray/20 bg-white/80 w-10 h-10 
          flex flex-row items-center justify-center
          rounded-full shadow-md dark:shadow-black/30
          gloss hover:scale-99 ease-out duration-100 transition-transform cursor-pointer"
            >
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
          </div>
        )}
      </div>
      <CardOptions />
    </>
  )
}
export default Card
