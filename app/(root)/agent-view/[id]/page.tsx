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
import PopularCard from '@components/PopularCard'
import { Skeleton } from "@components/ui/skeleton"
import { Loader2, ArrowRightCircle } from "lucide-react"

const AgentViewPage = () => {
  const { id } = useParams()
  const [reportText, setReportText] = useState("")
  const [reporting, setReporting] = useState(false)
  const notification = useNotification()
  const { session } = useUser()
  const isYou = session?.user.id === id
  const { data: agent } = useGetUser({ id: id?.toString(), enabled: !!id, page: "1", limit: 1 })
  const { data: listings,isLoading,hasNextPage,fetchNextPage,isFetchingNextPage} = useGetAgentListingsInfinite({ id: id?.toString(), enabled: !!id, page: "1", limit: 10,school:'',location:''})
  const useNextpageRef = useNextPage({hasNextPage,fetchNextPage,isFetchingNextPage})


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
      if(!session?.user) {
        notification.setDuration(3000)
        notification.setType('warning')
        notification.setMessage("You need to be logged in to report an agent")
      }
    } catch (err) {
      setReporting(false)
    }
  }

  return (
    <>
    <div className="agentProfile w-[80%] mx-auto mb-6 mt-20 p-6 rounded-lg shadow-md">
      <Agent agent={agent} />

      {/* report user */}
     {!isLoading && (
      !isYou && (
        <div className="reportUser mt-4">
          <h2 className="subheading font-semibold mb-2">Report Agent</h2>
          <p>If you have any issues with this agent, please report them.</p>
          <form
            onSubmit={handleReport}
            className="mt-4"
          >
            <textarea
              required
              className="w-full resize-none p-2 border rounded"
              rows={6}
              placeholder="Describe the issue..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            ></textarea>
            <button
              type="submit"
              disabled={reporting}
              className="mt-2 px-4 py-2 bg-red-800 text-white rounded hover:opacity-90"
            >
              {reporting ? "Sending..." : "Send Report"}
            </button>
          </form>
        </div>
      )
    )}
    </div>
    {listings?.pages[0]?.listings.length > 0 && (
      <>
    <div className="subheading flex items-center gap-1 ml-4 my-2 overflow-clip [word-spacing:3px]">
     {isYou ? 'Your Listings'  : `Listings From ${agent?.username}`}
      <ArrowRightCircle className="w-5 h-5"/>
       </div>
    {isLoading ?
  <div className="mx-auto p-4 flex flex-wrap items-center  ">
  {Array.from({ length: 10 }).map((_, i) => (
    <Skeleton
      key={i}
      className="w-40 h-40 bg-gray-500 animate-none"
    />
  ))}
</div>
    :<div className="py-4 popularList  w-full flex flex-wrap justify-evenly items-center gap-8">
        {listings?.pages.flatMap((item) => {
         return (
            item.listings.flatMap((listingItem: Listing,index:number) => {
          return (  <PopularCard 
            key={listingItem._id} 
            listing={listingItem}
            refValue={index === item.listings.length - 1 ? useNextpageRef : null}
            />)
        })
        )
    })}
    </div>}
    </>
   
    )}
    {isFetchingNextPage && hasNextPage && <Loader2 className='animate-spin mx-auto text-gray-500 dark:text-white my-4'/> }
    </>
  )
}

export default AgentViewPage
