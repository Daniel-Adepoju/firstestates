"use client"

import { useParams } from "next/navigation"
import Agent from "@components/agent/Agent"
import { useGetUser } from "@lib/customApi"
import { useState } from "react"
import { sendNotification } from "@lib/server/notificationFunctions"
import { useNotification } from "@lib/Notification"
import { useUser } from "@utils/user"
import { useGetAgentListings } from "@lib/customApi"
import PopularCard from '@components/PopularCard'
import { Listing } from "@components/Card"
import { Skeleton } from "@components/ui/skeleton"

const AgentViewPage = () => {
  const { id } = useParams()
  const [reportText, setReportText] = useState("")
  const [reporting, setReporting] = useState(false)
  const notification = useNotification()
  const { session } = useUser()

  const { data: agent } = useGetUser({ id: id?.toString(), enabled: !!id, page: "1", limit: 1 })
  const { data: listings,isLoading} = useGetAgentListings({ id: id?.toString(), enabled: !!id, page: "1", limit: 10,school:'',location:''})
  console.log(listings)
  const handleReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReporting(true)
    try {
     await sendNotification({
        type: "report",
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
    } catch (err) {
      setReporting(false)
    }
  }

  return (
    <>
    <div className="agentProfile w-[80%] mx-auto mb-6 mt-20 p-6 rounded-lg shadow-md">
      <Agent agent={agent} />

      {/* report user */}
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
    </div>
    {listings?.listings?.length > 0 && (
      <>
    <div className="subheading mx-auto my-2 overflow-clip">
      Recent Listings From {agent?.username} 
       </div>
    {isLoading ?
  <div className="mx-auto p-4 flex flex-wrap items-cener justify-center gap-4">
  {Array.from({ length: 10 }).map((_, i) => (
    <Skeleton
      key={i}
      className="w-40 h-40 bg-gray-500 animate-none"
    />
  ))}
</div>
    :<div className="py-4 popularList  w-full flex flex-wrap justify-evenly items-center gap-8">
        {listings?.listings.map((listing: Listing) => (
        <PopularCard key={listing._id} listing={listing} />
      ))} 
    </div>}
    </>
    )}
    </>
  )
}

export default AgentViewPage
