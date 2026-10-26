"use client"
import dynamic from "next/dynamic"
import React from "react"
import { getListingTier, listingTierItems } from "@lib/constants"
import { Check, Coins, Crown, Zap } from "lucide-react"
import { daysLeft } from "@utils/date"
import { useSignals, useSignal } from "@preact/signals-react/runtime"
const PaystackBtn = dynamic(() => import("@components/PayStackButton"), { ssr: false })

const EditTier = ({ data, editRanks, handleUpgrade, email }: any) => {
  useSignals()
  const tier = getListingTier(data?.post.listingTier)
  const tierIcons: any = { Standard: Zap, Gold: Coins, First: Crown }


  return (
    <div className="w-full col-span-2 text-foreground text-sm">
      <div className="mx-auto mb-6 w-[90%] rounded-2xl border border-[#0881a3]/15 bg-slate-50 p-5 text-center capitalize dark:border-white/10 dark:bg-[#0d1b30]">
        This listing is currently a
        <strong
          className={tier?.color}
        >
          {" "}
          {tier?.type}
        </strong>{" "}
        listing.
        <div>
          Validity: <strong className="text-red-500">{daysLeft(data?.post.validUntil)}</strong> days
          left.
        </div>
      </div>

      <div className="grid gap-5 p-2 md:grid-cols-2 lg:grid-cols-3">
        {listingTierItems.map((listing) => {
          const currentRank = editRanks[data?.post?.listingTier]
          const newRank = editRanks[listing.type.toLowerCase()]

          return (
            <div
              key={listing?.key}
              className={`tier-card ${listing.type === "Gold" ? "tier-card--gold" : listing.type === "First" ? "tier-card--first" : ""}`}
            >
              <div className="tier-card__icon"><>{(() => { const Icon = tierIcons[listing.type]; return <Icon size={24} /> })()}</></div>
              <h2 className="mb-2 mt-5 text-2xl font-bold">{listing.type}</h2>

              <p
                className={`text-xl font-semibold mb-4  ${listing?.color}
            `}
              >
                {listing.price}
              </p>

              <ul className="mb-4 space-y-3">
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
                amount={listing?.amount}
                successFunction={() => handleUpgrade(listing.type.toLowerCase())}
                className="tier-action w-full mt-auto"
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
