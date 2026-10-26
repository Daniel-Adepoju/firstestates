import Image from "next/image"
import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { truncateText } from "@utils/truncateText"
import { Toilet, Bed, Bath, MapPin, Eye, Tag, X, ChevronDown } from "lucide-react"
import { useState } from "react"

const CardBody = ({ listing, edit, isAgentCard, address, weeklyViews, totalViews, showMore, setShowMore }: any) => {
  const [isTagVisible, setIsTagVisible] = useState(false)
  return (
    <div className="body dark:bg-white gap-3 pb-5 pt-4">
      {/* Property type */}

      <div
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#0881a3]/15 bg-[#0881a3]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0874c7] shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-sky-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className="fill-current"
        >
          <path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 15 L 14 15 L 14 21 L 20 21 L 20 12 L 23 12 Z" />
        </svg>

        <span className="leading-none">{listing?.listingType}</span>
      </div>

      {/* location */}
      <div className="heading location mt-0 pl-0 text-2xl leading-tight">{listing?.location}</div>

      {/* address */}
      <div className="address flex min-w-0 items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300">
        <MapPin size={17} className="shrink-0 text-goldPrimary" />
        {/* text-goldPrimary dark:text-bluePrimary <<- text-goldPrimary */}
        <span className="truncate">{truncateText(address, 34)}</span>
      </div>

      {!edit && (
        <>
          {/* amenities */}
          <div className="home_details mb-1 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50/80 py-3 font-list dark:border-white/10 dark:bg-white/[0.03]">
            <div>
              <Bed size={20} className="text-goldPrimary" />
              <span className="text-xs text-gray-700 dark:text-white">{listing?.bedrooms} beds</span>
            </div>
            <div>
              <Bath size={20} className="text-goldPrimary" />
              <span className="text-xs text-gray-700 dark:text-white">{listing?.bathrooms} baths</span>
            </div>
            <div>
              <Toilet size={20} className="text-goldPrimary" />
              <span className="text-xs text-gray-700 dark:text-white">{listing?.toilets} toilets</span>
            </div>
          </div>

          <div className="mx-auto rounded-xl border border-slate-200/70 bg-white/70 dark:border-white/10 dark:bg-white/[0.02]">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setShowMore(!showMore)
              }}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-bold text-slate-600 transition hover:text-[#0874c7] dark:text-slate-300 dark:hover:text-sky-300"
            >
              <span>{showMore ? "Hide listing details" : "View listing details"}</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${showMore ? "rotate-180" : ""}`} />
            </button>
            {showMore && (
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/70 px-3 py-3 text-xs font-semibold dark:border-white/10">
                <span className={`rounded-full px-2.5 py-1 text-white capitalize ${listing?.status === "rented" ? "bg-goldPrimary" : "bg-emerald-600"}`}>
                  {listing?.status}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {listing?.status === "rented" ? listing?.requestCounts?.roommate : listing?.requestCounts?.coRent} {listing?.status === "rented" ? "roommate" : "co-rent"} requests
                </span>
              </div>
            )}
          </div>

          {/* unique to client */}

          {/* agent */}
          {!isAgentCard && (
            <div className="flex w-full flex-col items-center gap-2 pt-3 font-list dark:border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Listed by</span>
              <div className="flex min-w-0 max-w-full items-center justify-center gap-2 text-sm font-bold">
                <Link
                  onClick={(e) => e.stopPropagation()}
                  href={`/agent-view/${listing?.agent?._id}`}
                  className="flex min-w-0 max-w-full items-center justify-center gap-2"
                >
                  <CldImage
                    width={30}
                    height={30}
                    crop={"auto"}
                    gravity="center"
                    alt="agent pic"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[#0881a3]/15"
                    src={listing?.agent?.profilePic}
                  />
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="quickLink truncate">{listing?.agent?.username}</span>
                    {listing?.agent?.isPremium && (
                      <Image
                        src={"/icons/gold-badge.svg"}
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

          {/* Set show tags */}
          {!isAgentCard && listing?.tags && listing?.tags.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsTagVisible(!isTagVisible)
              }}
              className="mt-1 inline-flex w-fit select-none items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#0881a3]/30 hover:bg-[#0881a3]/5 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            >
              <span className="flex items-center gap-1.5">
                {isTagVisible ? (
                  <>
                    Hide Tags
                    <X
                      strokeWidth={3}
                      className="w-3.5 h-3.5 opacity-70"
                    />
                  </>
                ) : (
                  <>
                    <Tag
                      strokeWidth={3}
                      className="w-3.5 h-3.5 opacity-70"
                    />
                    Show Tags
                  </>
                )}
              </span>
            </button>
          )}

          {/* tags */}
          {isTagVisible && !isAgentCard && (
            <div className="flex items-center justify-start p-0 flex-wrap gap-2 mt-2 ml-3">
              {listing?.tags &&
                listing?.tags.length > 0 &&
                listing?.tags?.map((tag: any) => (
                  <span
                    key={tag}
                    className={`
    px-3 py-1 rounded-xl text-xs font-semibold capitalize
    ${
      tag.includes("new") || tag.includes("free")
        ? "bg-green-200 dark:bg-green-300 text-green-700 dark:text-green-800 border border-green-200"
        : tag.includes("walk") || tag.includes("trek")
          ? "bg-yellow-200 dark:bg-yellow-300 text-yellow-700 border border-yellow-200"
          : tag.includes("female")
            ? "bg-pink-200 dark:bg-pink-300 text-pink-700 dark:text-pink-800 border border-pink-200"
            : tag.includes("male")
              ? "bg-blue-200 dark:bg-blue-300 text-blue-700 dark:text-blue-800 border border-blue-200"
              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
    }
  `}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          )}

          {/* views */}
          {isAgentCard && (
            <div className="w-full flex flex-col pt-1 gap-2 pl-3 font-semibold">
              <div className="text-gray-500 dark:text-gray-400 flex flex-row gap-3 items-center text-sm">
                <Eye size={20} />
                Views this week
                <span className="views smallNum text-gray-700 dark:text-white">{weeklyViews}</span>
              </div>

              <div className="text-gray-500 dark:text-gray-400 flex flex-row gap-3 items-center text-sm">
                <Eye size={20} />
                All-time views
                <span className="views smallNum">{totalViews}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CardBody
