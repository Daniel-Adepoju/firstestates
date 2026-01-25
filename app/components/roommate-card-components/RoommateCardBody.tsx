"use client"

import { CldImage } from "next-cloudinary"
import { AlertTriangle, ArrowRight, Bookmark, Mars, MessageCircle, Venus } from "lucide-react"
import Link from "next/link"
import { daysLeft } from "@utils/date"

interface Props {
  request: Request
  showListing: boolean
  setShowListing: (v: boolean) => void
  bookmarkMutation: any
  isAgent: boolean
  userId: string
  reportRef: any
}

const RoommateCardBody = ({
  request,
  showListing,
  setShowListing,
  bookmarkMutation,
  isAgent,
  userId,
  reportRef,
}: Props) => {
  const isMale = request?.preferredGender === "male"

  return (
    <div
      className={`
        relative h-[520px] w-full overflow-hidden rounded-3xl
        bg-white dark:bg-gray-900
        shadow-2xl ring-1 ring-black/10 dark:ring-black/10
        transition-all duration-300 hover:shadow-2xl
        ${isMale ? "green-gradient-vertical" : "pink-gradient-vertical"}
      `}
    >
      {/* ─── PHOTO / HEADER ──────────────────────────────────────── */}
      <div className="relative h-70 w-full">
        <CldImage
          src={
            showListing
              ? (request?.listing?.mainImage ?? "/fallback-listing.jpg")
              : (request?.requester?.profilePic ?? "/fallback-avatar.jpg")
          }
          alt={showListing ? "listing" : "requester"}
          width={1000}
          height={700}
          crop="auto"
          // gravity="center"
          className="absolute inset-0 h-full w-full object-fit brightness-95"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />

        <button
          onClick={() => setShowListing(!showListing)}
          className="
            absolute top-4 right-1 -translate-x-1
            z-10 rounded-full bg-black/60 px-6 py-2.5 text-xs font-semibold text-white
            backdrop-blur-md border border-black/10
            shadow-lg hover:bg-gray-700/50 transition
          "
        >
          {showListing ? "Back to Applicant" : "View Listing"}
        </button>

        {!showListing && (
          <div className="absolute bottom-21 left-6 right-6 z-10">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                {request?.requester?.username}
              </h2>

              <div
                className={`
                  flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1
                  text-sm font-medium text-white backdrop-blur-md
                  ${isMale ? "ring-2 ring-green-400/50" : "ring-2 ring-pink-400/50"}
                `}
              >
                {isMale ? (
                  <Mars className="h-4 w-4 text-green-400" />
                ) : (
                  <Venus className="h-4 w-4 text-pink-400" />
                )}
                {isMale ? "Male" : "Female"}
              </div>
            </div>
          </div>
        )}

        {/* description / go to listing */}
        {!showListing ? (
          // Description
          <div
            className={`
           w-[99.9%] h-16 absolute bottom-0 flex-1 overflow-y-auto rounded-lg rounded-bl-none rounded-br-none bg-gray-500/20 p-4 py-3 text-sm leading-relaxed
          shadow-inner bar-custom text-white
            border border-gray-700/50 whitespace-pre-wrap
            ${isMale ? "green-bar" : "pink-bar"}
          `}
          >
            <p className="whitespace-pre-wrap text-gray-200 text-xs">
              {request?.description || "No description provided."}
            </p>
          </div>
        ) : (
          // View Listing
          <Link
            href={`/listings/single_listing?id=${request?.listing?._id}`}
            className="absolute bottom-2 left-[25%] border-2 border-black/10 inline-flex items-center gap-2
             rounded-full bg-black/60 px-6 py-2.5  font-semibold text-xs
              text-white backdrop-blur-md hover:bg-gray-700/50 transition"
          >
            View Full Listing
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}

      </div>

      {/* ─── INFO SECTION ────────────────────────────────────────── */}
      <div className="flex h-40 flex-col p-6 pt-4 pb-1">
        {/* gender and move-in-date */}
        <div className="mb-4 flex flex-wrap gap-2">
          <div
            className={`
              flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium
              ${isMale ? "bg-green-500/10 text-green-300" : "bg-pink-500/20 text-pink-300"}
            `}
          >
            {isMale ? <Mars size={14} /> : <Venus size={14} />}
            Looking for a {' '}
             {/* {isMale ? "male" : "female"}{" "} */}
            {request?.requestType === "roommate" ? "roommate" : "co-renter"}
          </div>

          {request?.moveInDate && (
            <div className="rounded-full bg-gray-700/30 px-3 py-1 text-xs font-medium text-gray-200 backdrop-blur-sm">
              Move-in: {new Date(request.moveInDate).toLocaleDateString()} (
              {daysLeft(request.moveInDate)} days)
            </div>
          )}
        </div>

        {/* description */}
        {/* <div
          className={`
            flex-1 overflow-y-auto rounded-2xl bg-white/90 p-4 text-sm leading-relaxed
            dark:bg-gray-800/80 shadow-inner bar-custom
            border border-gray-200/50 dark:border-gray-700/50
            ${isMale ? "green-bar" : "pink-bar"}
          `}
        >
          <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {request?.description || "No description provided."}
          </p>
        </div> */}

        {/* Action Buttons */}
        <div className="mt-5 flex justify-center gap-6">
          <Link href={`chat?recipientId=${request?.requester?._id}`}>
            <button className="flex flex-col items-center gap-1 text-white transition hover:scale-105">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 shadow-lg">
                <MessageCircle size={26} />
              </div>
              <span className="text-xs font-medium">Chat</span>
            </button>
          </Link>

          {!isAgent && (
            <button
              onClick={() =>
                bookmarkMutation.mutate({
                  requestId: request?._id,
                  userId,
                  action: "bookmarkRequest",
                })
              }
              className="flex flex-col items-center gap-1 text-white transition hover:scale-105"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-goldPrimary shadow-lg">
                <Bookmark
                  size={26}
                  fill={request?.isBookmarkedByUser ? "white" : "none"}
                />
              </div>
              <span className="text-xs font-medium">Bookmark</span>
            </button>
          )}

          <button
            onClick={() => reportRef.current?.showModal?.()}
            className="flex flex-col items-center gap-1 text-white transition hover:scale-110"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 shadow-lg">
              <AlertTriangle size={26} />
            </div>
            <span className="text-xs font-medium">Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoommateCardBody
