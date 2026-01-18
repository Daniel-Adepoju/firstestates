import Image from "next/image"
import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { truncateText } from "@utils/truncateText"
import { Toilet, Bed, Bath, MapPin, Eye } from "lucide-react"

const CardBody = ({ listing, edit, isAgentCard, address, weeklyViews, totalViews }: any) => {
  return (
    <div className="body">
      {/* location */}
      <div className="heading location">{listing?.location}</div>

      {/* address */}
      <div className="address flex flex-row items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
        <MapPin
          size={24}
          className="text-goldPrimary"
        />
        {/* text-goldPrimary dark:text-bluePrimary <<- text-goldPrimary */}
        <span>{truncateText(address, 30)}</span>
      </div>

      {!edit && (
        <>
          {/* amenities */}
          <div className="home_details font-list foont-bold">
            <div>
              <Bed
                size={30}
                className="text-goldPrimary"
              />
              <span className="text-gray-700 dark:text-white">{listing?.bedrooms}</span>
            </div>
            <div>
              <Bath
                size={30}
                className="text-goldPrimary"
              />
              <span className="text-gray-700 dark:text-white">{listing?.bathrooms}</span>
            </div>
            <div>
              <Toilet
                size={30}
                className="text-goldPrimary"
              />
              <span className="text-gray-700 dark:text-white">{listing?.toilets}</span>
            </div>
          </div>

          {/* unique to client */}

          {/* agent */}
          {!isAgentCard && (
            <div className="flex flex-col items-center justify-center self-center font-list font-bold">
              <div className="w-full text-sm flex flex-col items-center justify-start gap-1 break-words">
                <Link
                  onClick={(e) => e.stopPropagation()}
                  href={`/agent-view/${listing?.agent?._id}`}
                  className="block break-all text-start"
                >
                  <CldImage
                    width={30}
                    height={30}
                    crop={"auto"}
                    gravity="center"
                    alt="agent pic"
                    className="my-1 rounded-full object-cover"
                    src={listing?.agent?.profilePic}
                  />
                  <div className="flex items-center gap-1">
                    <span className="quickLink">{listing?.agent?.username}</span>
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

          {/* tags */}
          {/* catch words new ->> free ->> */}
          {!isAgentCard && (
            <div className="flex items-center justify-start p-0 flex-wrap gap-2 mt-2 ml-3">
              {/* property type */}
              {listing?.listingType && (
                <span
                  className="px-4 py-1 rounded-lg text-xs font-semibold
    text-white bg-sky-600"
                >
                  {listing?.listingType}
                </span>
              )}

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
                Past Week Views
                <span className="views smallNum text-gray-700 dark:text-white">{weeklyViews}</span>
              </div>

              <div className="text-gray-500 dark:text-gray-400 flex flex-row gap-3 items-center text-sm">
                <Eye size={20} />
                Total Views
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
