"use client"
import Image from "next/image"
import { useState } from "react"
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
      <div className="w-full">
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
            <div
              className=" headersFont mx-auto px-3 py-2 mt-2
                bg-gray-50 dark:bg-gray-800/10 text-sm font-medium
                 text-gray-700 dark:text-gray-200 shadow-sm  rounded-md"
            >
              {listing?.school}
            </div>
            {/* agent */}
            {!isAgentCard && (
              <div className="w-full font-bold font-list">
                <div
                  className="w-full text-sm 
        items-center justify-start
         break-words otherCard rounded-2xl "
                >
                  <Link
                    onClick={(e) => e.stopPropagation()}
                    href={`/agent-view/${listing?.agent?._id}`}
                    className="block break-all text-start  agentCardName"
                  >
                    <CldImage
                      width={30}
                      height={30}
                      alt="agent pic"
                      crop={"auto"}
                      className="my-1 rounded-full"
                      src={listing.agent.profilePic}
                    />
                    <div className="flex items-center gap-1">
                      <span className="quickLink">{listing.agent.username}</span>
                      {listing?.agent?.isTierOne && (
                        <Image
                          src={"/icons/gold-badge.svg"}
                          alt="badge"
                          width={18}
                          height={18}
                          className="rounded-full"
                        />
                      )}
                      {listing?.agent?.isTierTwo && (
                        <Image
                          src={"/icons/silver-badge.svg"}
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
