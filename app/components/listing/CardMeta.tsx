import { ChevronDown, User2 } from "lucide-react"
import { formatNumber } from "@utils/formatNumber"
import { Bed, Home, User } from "lucide-react"

const CardMeta = ({ listing, showMore, setShowMore, isAgentCard, isEdit }: any) => {
  const priceUnitIconMap: any = {
    perPerson: User,
    perRoom: Bed,
    entireUnit: Home,
  }

  const PriceIcon = priceUnitIconMap[listing?.priceUnit]

  return (
    <>
      {/*more content --> listing availability status,school and price*/}
      <div className="capitalize absolute top-0 left-[1px] flex flex-col gap-1 px-2 z-2">
        {isAgentCard && isEdit && (
          <div
            className={`tag no_absolute ${
              listing?.status === "rented" && "rented"
            } w-25 self-start px-3.5 py-2 text-sm rounded-md headersFont`}
          >
            {listing?.status}
          </div>
        )}

        {!isEdit && (
          <>
            {/* school*/}
            <div className="hyphen-auto truncate self-start headersFont w-25
             inline-flex item-center justify-center
              px-3 py-2 bg-white dark:bg-gray-700
               text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md">
              {listing?.school}
            </div>

            {/* price */}

            <div
              className="hyphen-auto tracking-wide
          self-start text-greenPrimary
         w-25 inline-flex items-center justify-center gap-1 
         px-3.5 py-2 rounded-md bg-gray-50 dark:bg-gray-700
          text-sm font-bold  shadow-sm"
            >
              <span className="text-sm">&#8358;{formatNumber(Number(listing?.price) || 0)}</span>
              {/* <Bed
           size={15}
           strokeWidth={3} 
           className="text-greenPrimary"
           /> */}
              {listing.priceUnit && (
                <PriceIcon
                  size={20}
                  className="text-greenPrimary"
                />
              )}
            </div>

            {/* status */}
            {showMore && (
              <div
                className={`bg-[#179217] animation-slide-in-top-faster ${
                  listing?.status === "rented" && "bg-goldPrimary"
                } w-25 ml-0 self-start px-3 py-2 rounded-md headersFont text-white  inline-flex item-center justify-center  text-sm font-medium`}
              >
                {listing?.status}
              </div>
            )}

            {/* co-rent and roomie requests */}
            {showMore && (
              <div
                className={`animation-slide-in-top-fast headersFont w-full self-start inline-flex items-center justify-center gap-1 px-3.5  py-2 rounded-md ${
                  listing?.status === "rented" ? "bg-goldPrimary" : "bg-[#179217]"
                } text-sm font-medium shadow-sm`}
              >
                {listing?.status === "rented" ? (
                  <span className="text-sm text-white ">
                    {listing?.requestCounts.roommate} Roommate Request
                  </span>
                ) : (
                  <span className="text-sm text-white ">
                    {listing?.requestCounts.coRent} Co-Rent Requests
                  </span>
                )}
              </div>
            )}

            {/* showmore btn */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                setShowMore(!showMore)
              }}
              className="clickable bg-white dark:bg-gray-700 rounded-full self-start ml-2 p-1 h-6.5 w-6.5 flex items-center justify-center"
            >
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  showMore && "rotate-180"
                } duration-500 text-gray-700 dark:text-white`}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CardMeta
