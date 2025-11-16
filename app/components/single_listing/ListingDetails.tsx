"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { daysLeft } from "@utils/date"

interface Props {
  listing: any
}

const ListingDetails = ({ listing }: Props) => {
  return (
    <>
      <div className="price">
        <span className="currency">&#8358;</span> {listing?.price?.toLocaleString()}/Year
      </div>
      <div>
        <span className=" text-sm">
          This listing is valid for <strong>{daysLeft(listing?.validUntil)}</strong> days
        </span>
      </div>

      <div className="capitalize text-lg text-gray-600 dark:text-gray-200 font-semibold">
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
