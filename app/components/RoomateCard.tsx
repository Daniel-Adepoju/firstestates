import { CldImage } from "next-cloudinary"
import { AlertTriangle, ArrowLeft, ArrowRight, Bookmark,MapPin, MessageCircle } from "lucide-react"
import { useState } from "react"
import Button from "@lib/Button"
import { truncateAddress } from "@utils/truncateAddress"
import Link from "next/link"
import { useNextPage } from "@lib/useIntersection"

interface RoomateCardProps {
  request: Request,
  rentedRequest?: boolean
  refValue?: ReturnType<typeof useNextPage> | null
}
const RoomateCard = ({ request, rentedRequest,refValue}: RoomateCardProps) => {
  const [showListing, setShowListing] = useState(false)
  return  (
<div ref={refValue}>
  {!showListing ? (
    <div
      className={`snap-center w-90 h-50 rounded-sm p-2 mx-auto ${
        rentedRequest ? "bg-blue-600/90 dark:bg-amber-400/70" : "bg-darkblue dark:bg-coffee"
      }`}
    >
      <div className="flex flex-col">
        <Button
          className="clickable directional  text-white  h-32 mb-2  mt-[-7px] shadow-md"
          text="Show Listing"
          functions={() => setShowListing(true)}
        ></Button>
        <CldImage
          src={request?.requester?.profilePic}
          alt="ee"
          width={60}
          height={60}
          className="rounded-full w-12 h-12 mx-auto mb-1 outline-2 outline-gray-200"
        />
        <div className="text-white text-sm font-card mx-auto">{request?.requester?.username}</div>

        {/* options row */}
        <div className="w-full flex flex-row justify-around mt-2">
          <Link
          href={`chat?recipientId=${request?.requester?._id}`}
     >
           <div className="flex items-center gap-1 text-white font-bold">
            <MessageCircle
              size={30}
              color="white"
            />
            <span>Chat</span>
            </div>
          </Link>

          <div className="flex items-center gap-1 text-white font-bold">
            <Bookmark
              size={30}
              color="white"
            />
            <span>Bookmark</span>
          </div>

          <div className="flex items-center gap-1 text-white font-bold">
            <AlertTriangle
              size={30}
              color="white"
            />
            <span>Report</span>
          </div>
        </div>

        {/* description box */}
        <div className="w-full h-35 bg-white dark:bg-gray-700  shadow-md rounded-md mt-2.5 p-2 overflow-y-scroll nobar null border-1 border-black/30 dark:border-black">
          <p className="text-sm text-gray-700 dark:text-white font-head whitespace-pre-wrap">
           {request?.description}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`snap-center w-90 h-80 rounded-sm p-2 mx-auto ${
        rentedRequest ? "bg-blue-800/90 dark:bg-amber-400/70" : "bg-darkblue dark:bg-coffee"
      }`}
    >
      <div className="flex flex-col w-full">
        <Button
          className="clickable directional border-20 border-red-700 text-white  h-32 mb-2  mt-[-7px] shadow-md"
          text="Show Applicant"
          functions={() => {
            setShowListing(false)
          }}
        ></Button>
      {request?.listing.mainImage && (
         <CldImage
          src={request?.listing.mainImage}
          alt="ee"
          width={150}
          height={150}
          gravity="center"
          className="rounded-lg mx-auto w-full h-40 aspect-square object-fill object-center"
        />
  )}
      </div>
      {/* options row */}
      <div className="w-full h-25 flex flex-col items-center  gap-1.5 mt-1.5 py-2 rounded-sm bg-white dark:bg-gray-700 border-1 border-black/30 dark:border-black">
        <div className="text-lg font-bold self-start ml-8">
          {request?.listing.location}
        </div>
        <p className="text-sm font-head flex items-center gap-1">
          <MapPin
            size={15}
            className=" dark:text-white"
          />
          {truncateAddress(request?.listing.address, 38)}
        </p>
        <Link
        href={`/listings/single_listing?id=${request?.listing._id}`}
        className="flex items-center gap-1 font-bold cursor-pointer">
          <ArrowRight
            size={20}
            className="dark:text-white"
          />
          <span>View Listing</span>
        </Link>
      </div>
    </div>)
    }
</div>
  
  )
}

export default RoomateCard
