"use client"

import Link from "next/link"

const ListingTiers = () => {
  const listings = [
    {
      type: "Standard",
      price: "₦1000/month",
      border: "border-sky-500",
      benefits: [
        "Basic listing visibility",
        "Add up to 3 images",
      ],
      link: "/agent/listings/add?type=standard",
    },
    {
      type: "Gold",
      price: "₦2500/50 days",
      border: "border-goldPrimary", // assuming `gold-primary` maps to yellow-500
      benefits: [
        "Ability to feature listings",
        "Greater visibility than standard listing",
        "Add up to 5 images",
      ],
      link: "/agent/listings/add?type=gold",
    },
    {
      type: "First",
      price: "₦5000/75 days",
      border: "border-[#b647ff]",
      benefits: [
        "Enhanced listing visibility",
        "Priority display in search results",
        "Add up to 10 images",
        "Automatic featured listing",
      ],
      link: "/agent/listings/add?type=first",
      bonusClass:"md:col-span-2 md:mx-auto lg:col-span-1 lg:mx-0",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
      {listings.map((listing) => (
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
