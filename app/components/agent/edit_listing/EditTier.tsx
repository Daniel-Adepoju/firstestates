"use client"
import dynamic from "next/dynamic"
import React from "react"
import { listingTierItems } from "@lib/constants"
import { daysLeft } from "@utils/date"
import { useSignals, useSignal } from "@preact/signals-react/runtime"
const PaystackBtn = dynamic(() => import("@components/PayStackButton"), { ssr: false })

const EditTier = ({ data, editRanks, handleUpgrade, email }: any) => {
  useSignals()
  const creating = useSignal(false)

  return (
    <div className="w-full col-span-2 text-foreground text-sm">
      <div className="w-[90%] text-center mx-auto mb-4 capitalize">
        This listing is currently a
        <strong
          className={`
            ${data?.post.listingTier === "standard" && "text-sky-500"}
            ${data?.post.listingTier === "gold" && "text-goldPrimary"}
            ${data?.post.listingTier === "first" && "text-[#b647ff]"}
          `}
        >
          {" "}
          {data?.post.listingTier}
        </strong>{" "}
        listing.
        <div>
          Validity: <strong className="text-red-500">{daysLeft(data?.post.validUntil)}</strong> days
          left.
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
        {listingTierItems.map((listing) => {
          const currentRank = editRanks[data?.post?.listingTier]
          const newRank = editRanks[listing.type.toLowerCase()]

          return (
            <div
              key={listing.type}
              className={` ${
                listing.bonusClass && listing.bonusClass
              } gloss dark:bg-gray-700/50 text-gray-700 dark:text-gray-100 border-2 ${
                listing.border
              } rounded-2xl p-6 shadow-md smallScale transition cursor-pointer flex flex-col`}
            >
              <h2 className="text-2xl font-bold mb-2">{listing.type}</h2>

              <p
                className={`text-xl font-semibold mb-4  ${
                  listing.type === "First" && "text-[#b647ff]"
                } ${listing.type === "Gold" && "text-goldPrimary"} ${
                  listing.type === "Standard" && "text-sky-500"
                }`}
              >
                {listing.price}
              </p>

              <ul className="space-y-2 mb-4">
                {listing.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    • {benefit}
                  </li>
                ))}
              </ul>

              <PaystackBtn
                email={email}
                amount={
                  listing.type === "Standard"
                    ? 1000
                    : listing.type === "Gold"
                    ? 2500
                    : listing.type === "First"
                    ? 5000
                    : 1000
                }
                successFunction={() => handleUpgrade(listing.type.toLowerCase())}
                className="w-full mt-auto py-3 bg-darkblue text-white outline-1.5 dark:outline-black/40 rounded-lg font-bold hover:scale-99 transition"
                text={
                  currentRank === newRank
                    ? `Renew ${listing.type} listing`
                    : newRank > currentRank
                    ? `Upgrade to ${listing.type}`
                    : `Downgrade to ${listing.type}`
                }
              ></PaystackBtn>
            </div>
          )
        })}
      </div>

      <div className="w-[95%] mb-6 bg-gray-100/60 dark:bg-gray-700/30 p-4 px-6 rounded-md mx-auto mt-4">
        <ul className="font-medium w-full flex flex-col gap-2 text-sm list-disc">
          <li className="w-full">
            Your current valid days will{" "}
            <span className="text-goldPrimary font-head">roll over</span> and be added to your new
            tier’s validity.
          </li>
          <li>
            If your listing is already featured, it will{" "}
            <span className="text-goldPrimary font-head">remain featured</span> regardless of
            whether you upgrade or downgrade your tier.
          </li>
          <li>
            You can change your listing tier at{" "}
            <span className="text-goldPrimary font-head">any time</span>.
          </li>
          <li>
            Changing your tier does not delete or reset any of your{" "}
            <span className="text-goldPrimary font-head">listing details</span>.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default EditTier
