"use client"

import Link from "next/link"
import { listingTierItems } from "@lib/constants"

const ListingTiers = () => {

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
      {listingTierItems.map((listing) => (
        <Link
          href={listing.link}
          key={listing.type}
          className={` ${listing.bonusClass && listing.bonusClass} gloss  dark:bg-gray-700/50 text-gray-700 dark:text-gray-100  border-2 ${listing.border} rounded-2xl p-6 shadow-md smallScale transition cursor-pointer`}
        >
          <h2 className="text-2xl font-bold mb-2">{listing.type}</h2>
          <p className={`text-xl font-semibold mb-4  ${listing.type === "First" && "text-[#b647ff]"} ${listing.type === "Gold" && "text-goldPrimary"} ${listing.type === "Standard" && "text-sky-500"}`}>
            {listing.price}
          </p>
          <ul className="space-y-2">
            {listing.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">
                • {benefit}
              </li>
            ))}
          </ul>
        </Link>
      ))}
    </div>
  )
}

export default ListingTiers
