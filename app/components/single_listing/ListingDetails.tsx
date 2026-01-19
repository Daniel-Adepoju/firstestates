"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { daysLeft } from "@utils/date"

interface Props {
  listing: any
}

const ListingDetails = ({ listing }: Props) => {
  const priceDuration: any = {
    perYear: "Per Year",
    perMonth: "Per Month",
  }

  const priceUnitLabel: any = {
    entireUnit: "Entire Unit",
    perPerson: "Per Person",
    perRoom: "Per Room",
  }

  return (
    <>
      {/* <div className="price">
        <span className="currency">&#8358;</span> {listing?.price?.toLocaleString()} {priceDuration[listing?.priceDuration]}
        
      </div> */}
      {/* Listing Type */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide dark:shadow-black shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          className="fill-foreground"
        >
          <path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 15 L 14 15 L 14 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z"></path>
        </svg>
        {listing?.listingType}
      </div>

      <div className="flex flex-col items-start gap-1  p-4  w-fit">
        {/* Price */}
        <span className="price text-3xl font-extrabold text-gray-900 dark:text-white flex items-baseline">
          <span className="text-xl mr-1 currenc">&#8358;</span>
          {listing?.price?.toLocaleString()}
        </span>

        {/* Price unit */}
        {listing?.priceUnit && (
          <span className="text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            {priceUnitLabel[listing.priceUnit]}
          </span>
        )}

        {/* Price duration */}
        {listing?.priceDuration && (
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-400">
            {priceDuration[listing.priceDuration]}
          </span>
        )}
      </div>

      <div>
        <span className="font-medium tracking-wide text-xs text-gray-400">
          This listing will remain here for <strong>{daysLeft(listing?.validUntil)}</strong> days
        </span>
      </div>

      <div className="font-head capitalize text-sm text-gray-600 dark:text-gray-200 font-semibold">
        {listing?.school}
      </div>

      <div className="agent">
        <CldImage
          width={20}
          height={20}
          alt="agent pic"
          crop="auto"
          src={listing?.agent?.profilePic}
        />
        <div>
          Listed by{" "}
          <Link
            className="font-head quickLink"
            href={`/agent-view/${listing?.agent?._id}`}
          >
            {listing?.agent?.username}
          </Link>
        </div>
      </div>
    </>
  )
}

export default ListingDetails
