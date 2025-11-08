"use client"

import React from "react"

const ListingTypes = () => {
  const listings = [
    {
      type: "Standard",
      price: "₦1000/month",
      border: "border-sky-500",
      benefits: [
        "Basic listing visibility",
        "Add up to 3 images",
      ],
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
    },
    {
      type: "First",
      price: "₦5000/75 days",
      border: "border-[#b647ff]", // Platinum color
      benefits: [
        "Enhanced listing visibility",
        "Priority display in search results",
        "Add up to 10 images",
        "Automatic featured listing",
      ],
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6 ">
      {listings.map((listing) => (
        <div
          key={listing.type}
          className={`gloss  dark:bg-gray-700/50 text-gray-700 dark:text-gray-100  border-2 ${listing.border} rounded-2xl p-6 shadow-md smallScale transition cursor-pointer`}
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
        </div>
      ))}
    </div>
  )
}

export default ListingTypes
