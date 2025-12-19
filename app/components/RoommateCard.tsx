import { CldImage } from "next-cloudinary"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  MapPin,
  Mars,
  MessageCircle,
  Venus,
  X,
} from "lucide-react"
import { useRef, useState } from "react"
import Button from "@lib/Button"
import { truncateText } from "@utils/truncateText"
import Link from "next/link"
import { useNextPage } from "@lib/useIntersection"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useToast } from "@utils/Toast"
import { ReportModal } from "@components/Modals"
import { useUser } from "@utils/user"

interface RoommateCardProps {
  request: Request
  refValue?: ReturnType<typeof useNextPage> | null
  firstItem?: boolean
  lastItem?: boolean
  isAgent?: boolean
}
const RoommateCard = ({
  request,
  refValue,
  firstItem,
  lastItem,
  isAgent = false,
}: RoommateCardProps) => {
  const [showListing, setShowListing] = useState(false)
  const queryClient = useQueryClient()
  const { setToastValues } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const reportRef = useRef<any>(null)
  const { session } = useUser()
  const userId = session?.user.id || ""

  // bookmark requests
  const handleBookmark = async (val: any) => {
    try {
      const res = await axiosdata.value.patch(`/api/requests`, val)
      if (res.status === 200) {
        setToastValues({
          isActive: true,
          message: res?.data.message,
          status: "success",
          duration: 2000,
        })
      } else {
        setToastValues({
          isActive: true,
          message: "Request bookmarking failed",
          status: "danger",
          duration: 2000,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const bookmarkMutation = useMutation({
    mutationFn: handleBookmark,
    onSuccess: () => {
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ["requests"] })
    },
  })

  //  accepting requests
  const handleAccept = async (val: any) => {
    try {
      const res = await axiosdata.value.patch(`/api/requests`, val)
      if (res.status === 200) {
        setToastValues({
          isActive: true,
          message: "Request accepted successfully",
          status: "success",
          duration: 2000,
        })
      } else {
        setToastValues({
          isActive: true,
          message: "Request acceptance failed",
          status: "danger",
          duration: 2000,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  const acceptMutation = useMutation({
    mutationFn: handleAccept,
    onSuccess: () => {
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ["requests"] })
    },
  })

  // deleting requests
  const handleDelete = async (val: any) => {
    try {
      const res = await axiosdata.value.delete(`/api/requests`, { data: { id: val.id } })
      if (res.status === 200) {
        setToastValues({
          isActive: true,
          message: "Request deleted successfully",
          status: "success",
          duration: 2000,
        })
      } else {
        setToastValues({
          isActive: true,
          message: "Request deletion failed",
          status: "danger",
          duration: 2000,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  const deleteMutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      setIsDeleteOpen(false)
      queryClient.invalidateQueries({ queryKey: ["requests"] })
    },
  })

  return (
    <div
      ref={refValue}
      className={`w-90 snap-center ${firstItem ? "ml-10" : ""} ${lastItem ? "mr-10" : ""} `}
    >
      {isAgent && (
        <div className="flex items-center justify-start gap-4 pl-1">
          {/* Accept */}
          <Popover
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <PopoverTrigger>
              <div
                className={`clickable flex items-center justify-center bg-${
                  request?.requestType === "roommate" ? "goldPrimary" : "green-600"
                } rounded-full w-10 h-10 mb-1  mt-[-7px] shadow-sm`}
              >
                <Check color="white" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="z-800 flex flex-col items-center gap-2 shadow-sm bg-gray-100 dark:bg-gray-700">
              <div className="text-black dark:text-white">Accept this request</div>
              <div
                onClick={() =>
                  acceptMutation.mutate({
                    id: request?._id,
                    status: "accepted",
                    action: "acceptRequest",
                  })
                }
                className={`clickable text-white font-bold ${
                  request?.requestType === "roommate" ? "gold-gradient" : "bg-green-600"
                } rounded-2xl cursor-pointer w-24 h-8 flex items-center justify-center`}
              >
                {acceptMutation.isPending ? "Accepting" : "Accept"}
              </div>
            </PopoverContent>
          </Popover>

          {/* Decline */}
          <Popover
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          >
            <PopoverTrigger>
              <div className="clickable flex items-center justify-center bg-red-700 dark:bg-red-800 rounded-full w-10 h-10 mb-1  mt-[-7px] shadow-sm">
                <X color="white" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col items-center gap-2 shadow-sm bg-gray-100 dark:bg-gray-700">
              <div className="text-black dark:text-white">Decline this request</div>
              <div
                onClick={() => deleteMutation.mutate({ id: request?._id })}
                className="clickable text-white font-bold bg-red-700 dark:bg-red-800 rounded-2xl cursor-pointer w-24 h-8 flex items-center justify-center"
              >
                {deleteMutation.isPending ? "Deleting" : "Delete"}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {!showListing ? (
        <div
          key={request._id}
          className={`w-full h-60 rounded-sm p-2 mx-auto
            ${
              request?.requestType === "roommate"
                ? "gold-gradient-vertical"
                : "green-gradient-vertical"
            }
            `}
        >
          <ReportModal
            ref={reportRef}
            userId={userId}
            reportedUser={request?.requester?._id}
            action={request?.requestType === "roommate" ? "roommate request" : "co-rent request"}
          />
          <div className="flex flex-col">
            <Button
              className="clickable directional font-medium text-sm  text-white  h-32 mb-2  mt-[-7px] shadow-md"
              text="Show Listing"
              functions={() => setShowListing(true)}
            ></Button>
            {!showListing && (
              <CldImage
                src={request?.requester?.profilePic}
                alt="ee"
                width={60}
                height={60}
                className="rounded-full w-12 h-12 mx-auto mb-1 outline-2 outline-gray-200"
              />
            )}

            {/* requester name */}
            <div className="text-white text-sm font-card mx-auto py-0.5">
              {request?.requester?.username}
            </div>
            {/* request type  */}
            {isAgent && (
              <div className="text-white text-sm font-bold font-head mx-auto py-1  px-6 rounded-lg border-2 border-gray-700/20 bg-black/10">
                {request?.requestType === "roommate" ? "Roommate Request" : "Co-rent Request"}
              </div>
            )}

            {/* options row for request */}

            <div className="w-full flex flex-row justify-around mt-2 ">
              <Link href={`chat?recipientId=${request?.requester?._id}`}>
                <div className="flex items-center gap-1 text-white font-bold">
                  <MessageCircle
                    size={30}
                    color="white"
                  />
                  <span>Chat</span>
                </div>
              </Link>
              {!isAgent && (
                <div
                  onClick={() => {
                    bookmarkMutation.mutate({
                      requestId: request?._id,
                      userId: request?.requester?._id,
                      action: "bookmarkRequest",
                    })
                  }}
                  className="flex items-center gap-1 text-white font-bold cursor-pointer"
                >
                  <Bookmark
                    size={30}
                    color="white"
                    fill={request?.isBookmarked ? "white" : "none"}
                  />
                  <span>Bookmark</span>
                </div>
              )}
              <div
                onClick={() => reportRef.current.showModal()}
                className="flex items-center gap-1 text-white font-bold cursor-pointer"
              >
                <AlertTriangle
                  size={30}
                  color="white"
                />
                <span>Report</span>
              </div>
            </div>

            {/* description box */}
            <div className="w-full h-35 bg-white dark:bg-gray-700  shadow-md dark:shadow-black rounded-md mt-2.5 p-2 overflow-y-scroll nobar null border-1 border-black/30 dark:border-black">
              {/* preferred gender */}
              {request?.preferredGender === "male" ? (
                <div className="flex items-center gap-1 font-head">
                  <Mars className="text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-white">
                    Looking for a male{" "}
                    {request?.requestType === "roommate" ? "roommate" : "co-renter"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 font-head">
                  <Venus className="text-pink-400" />
                  <span className="text-sm text-gray-700 dark:text-white">
                    Looking for a female{" "}
                    {request?.requestType === "roommate" ? "roommate" : "co-renter"}
                  </span>
                </div>
              )}

              {/* main description */}
              <p className="mt-2 mb-2 text-sm text-gray-700 dark:text-white  whitespace-pre-wrap">
                {request?.description}
              </p>

              {/* budget */}
              {request?.budget && (
                <div className="flex items-center gap-1 font-head">
                  <span className="text-sm text-gray-700 dark:text-white">
                    Budget: <span>&#8358;</span> {request?.budget.toLocaleString()} /
                    <span> &#8358;</span> {request?.listing?.price.toLocaleString()} (
                    {((request?.budget / request?.listing?.price) * 100).toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // listing
        <div
          key={request?.listing?._id}
          className={`w-90 h-80 rounded-sm p-2 mx-auto hover:shadow-md transition-shadow duration-300 ${
            request?.requestType === "roommate"
              ? "gold-gradient-vertical"
              : "green-gradient-vertical"
          }`}
        >
          <div className="flex flex-col w-full">
            <Button
              className="clickable directional font-medium text-sm text-white  h-32 mb-2  mt-[-7px] shadow-md"
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
            <div className="text-lg font-bold self-start ml-8">{request?.listing.location}</div>
            <p className="text-sm font-head flex items-center gap-1">
              <MapPin
                size={15}
                className=" dark:text-white"
              />
              {truncateText(request?.listing.address, 38)}
            </p>
            <Link
              href={`/listings/single_listing?id=${request?.listing._id}`}
              className="flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowRight
                size={20}
                className="dark:text-white"
              />
              <span>View Listing</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoommateCard
