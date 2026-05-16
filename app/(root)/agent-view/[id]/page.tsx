"use client"

import { useParams } from "next/navigation"
import Agent from "@components/agent/Agent"
import { useGetUser } from "@lib/customApi"
import { useState } from "react"
import { sendNotification } from "@lib/server/notificationFunctions"
import { useNotification } from "@lib/Notification"
import { useUser } from "@utils/user"
import { useGetAgentListingsInfinite } from "@lib/customApi"
import { useNextPage } from "@lib/useIntersection"
import PopularCard from "@components/listing/PopularCard"
import { Skeleton } from "@components/ui/skeleton"
import { Loader2, ArrowRightCircle, MoreHorizontal } from "lucide-react"

const AgentViewPage = () => {
  const { id } = useParams()
  const [reportText, setReportText] = useState("")
  const [reporting, setReporting] = useState(false)
  const notification = useNotification()
  const { session } = useUser()
  const [isActive, setIsActive] = useState(false)
  const isYou = session?.user.id === id
  const { data: agent } = useGetUser({ id: id?.toString(), enabled: !!id, page: "1", limit: 1 })
  const {
    data: listings,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetAgentListingsInfinite({
    id: id?.toString(),
    enabled: !!id,
    page: "1",
    limit: 10,
    school: "",
    location: "",
  })
  const useNextpageRef = useNextPage({ hasNextPage, fetchNextPage, isFetchingNextPage })

  const handleReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReporting(true)
    try {
      await sendNotification({
        type: "report_user",
        message: reportText,
        recipientRole: "admin",
        mode: "broadcast-admin",
        sentBy: session?.user?.id,
        reportedUser: agent?._id,
        thumbnail: agent?.profilePic || "",
      })
      notification.setIsActive(true)
      notification.setMessage("Report sent successfully")
      notification.setType("success")
      setReportText("")
      setReporting(false)
      if (!session?.user) {
        notification.setDuration(3000)
        notification.setType("warning")
        notification.setMessage("You need to be logged in to report an agent")
      }
    } catch (err) {
      setReporting(false)
    }
  }

  const loadingMap = Array.from({ length: 10 }).map((_, i) => (
    <Skeleton
      key={i}
      className="w-37 md:w-40 h-40 py-4 bg-gray-500/20 dark:bg-gray-500/40"
    />
  ))

  return (
    <div className="w-full lg:h-[calc(100vh-2em)] flex flex-col lg:flex-row lg:gap-1 lg:mt-12 lg:items-stretch  lg:overflow-hidden">
      <div
        className="bg-white dark:bg-darkGray w-[90%] md:w-[80%] mx-auto mb-6
    mt-20 p-6 rounded-lg shadow-sm dark:shadow-black/30
    lg:pb-2 lg:w-[70%] lg:mt-4 lg:p-4 lg:h-full lg:m-0 lg:mb-0 overflow-y-scroll bar-custom left-bar gold-bar"
      >
        <Agent
          agent={agent}
          isYou={isYou}
          handleReport={handleReport}
          isActive={isActive}
          setIsActive={setIsActive}
          reportText={reportText}
          setReportText={setReportText}
          reporting={reporting}
        />
      </div>

      <div className="w-[90%] md:w-[80%] lg:w-[40%] lg:h-full lg:pt-6 bg-white dark:bg-darkGray mx-auto mb-15 md:mb-0 gold-bar bar-custom lg:overflow-y-auto">
        <div className="subheading flex items-center gap-1 ml-4 my-2 lg:my-0 overflow-clip [word-spacing:3px]">
          {!agent ? (
            <MoreHorizontal className="animate-pulse  font-bold text-md" />
          ) : isYou ? (
            "Your Listings"
          ) : (
            `Listings From ${agent?.username || ""}`
          )}
          <ArrowRightCircle className="w-5 h-5" />
        </div>

        {!isLoading ? (
          <div
            className="w-full md:w-[98%] mx-auto lg:my-2 lg:pt-1 mt-1 mb-6 md:mb-2 p-4 dark:bg-darkGray rounded-lg
           custom-shadow
                    "
          >
            <div className="w-full flex flex-wrap justify-center items-center gap-3 md:gap-8 md:gap-y-6 gap-y-4">
              {listings?.pages.flatMap((item) => {
                return item.listings.flatMap((listingItem: Listing, index: number) => {
                  return (
                    <PopularCard
                      key={listingItem._id}
                      listing={listingItem}
                      isAnimation={true}
                      wAndH={"w-37 md:w-40 min-h-40"}
                      refValue={index === item.listings.length - 1 ? useNextpageRef : null}
                    />
                  )
                })
              })}
            </div>

            {isFetchingNextPage && hasNextPage && (
              <Loader2 className="flex-1 justify-self-center animate-spin mx-auto text-gray-500 dark:text-white mt-6 mb-1" />
            )}
          </div>
        ) : (
          <div className="w-[90%] pb-12 md:pb-6 mx-auto mt-5 flex flex-wrap justify-center items-center gap-3 md:gap-8 md:gap-y-6 gap-y-4">
            {loadingMap}
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentViewPage
