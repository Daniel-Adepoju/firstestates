"use client"
import React, { useState } from "react"
import { CldImage } from "next-cloudinary"
import { truncateAddress } from "@utils/truncateAddress"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDarkMode } from "@lib/DarkModeProvider"
import { MapPin, Star } from "lucide-react"
import { formatNumber } from "@utils/formatNumber"
import { CardProps } from "./Card"

const FeaturedCard = ({ edit, listing, isAgentCard }: CardProps) => {
  const [address] = useState(listing?.address || "Nigeria")
  const router = useRouter()
  const { darkMode } = useDarkMode()

  const visitCard = () => {
    router.push(`/listings/single_listing?id=${listing?._id}`)
  }

  return (
    <>
      <div className="cardContainer">
        <div
          onClick={visitCard}
          className="card"
        >
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
          </div>

          <div className="body">
            <div className="w-full"></div>
            <div className="location heading">{listing?.location}</div>
            <div className="address">
              <MapPin
                size={24}
                color={darkMode ? "#A88F6E" : "#0874c7"}
              />
              <span>{truncateAddress(address, 30)}</span>
            </div>
            <div className="w-full text-xl dark:text-gray-300 text-gray-500 font-bold p-2 pb-0 rounded-sm">
              {listing?.school}
            </div>
            {!isAgentCard && (
              <div className="agent">
                <div
                  className="w-full text-sm 
        items-center justify-start
         break-words otherCard rounded-2xl shadow-xs"
                >
                  <Link
                    onClick={(e) => e.stopPropagation()}
                    href={`/agent-view/${listing?.agent?._id}`}
                    className="block break-all text-start  agentCardName"
                  >
                    <CldImage
                      width={20}
                      height={20}
                      alt="agent pic"
                      className="my-1"
                      src={listing.agent.profilePic}
                    />
                    {listing.agent.username}
                  </Link>
                </div>
              </div>
            )}{" "}
          </div>
          <div className="tag">
            <Star
              size={20}
              color="#f59e0b"
            />
          </div>
          <div className="tag price">{formatNumber(Number(listing?.price) || 0)}</div>
        </div>
      </div>
    </>
  )
}
export default FeaturedCard
