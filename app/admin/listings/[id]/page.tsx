"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { useGetSingleListing } from "@lib/customApi"
import Card from "@components/Card"
import { Skeleton } from "@components/ui/skeleton"
import { Link as LinkIcon, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { editListing } from "@lib/server/listing"
import { clearAllNotifications, clearSingleNotification } from "@lib/server/notificationFunctions"
import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"

const AdminSingleListing = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { data: listing, isLoading } = useGetSingleListing(id)
  const [currentRemoveId, setCurrentRemoveId] = useState<string[]>([])

  const removeSingleReport = async (reportId: string) => {
    await clearSingleNotification(reportId, true, listing?.post._id)
    if(listing.reports.length === 1) {
      await editListing({id,reportedBy: [] }, null, true)
    }
  }

  const removeAllReports = async () => {
    await editListing({id,reportedBy: [] }, null, true)
    await clearAllNotifications({ isReport: true, listingId: listing?.post._id })
  }

  const singleReportMutation = useMutation({
    mutationFn: removeSingleReport,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["listing", { listingId: listing?.post._id }] }),
  })

  const allReportsMutation = useMutation({
    mutationFn: removeAllReports,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing", { listingId: listing?.post._id }] })
      queryClient.invalidateQueries({ queryKey: ["reports"] })
    }
  })

  const handleRemoveSingleReport = (reportId: string) => {
    singleReportMutation.mutate(reportId)
  }

  const handleRemoveAllReports = () => {
    allReportsMutation.mutate()
  }

  return (
    <>
      <div className="mx-auto text-center w-100 md:w-full break-words">
        Note that you cannot delete a <strong>rented</strong> listing, you have to edit its status
        to available first.
      </div>
      <div className="text-foreground mb-[-90px] lg:mb-[-45px] ">
        <span>This listing is </span>
        <span
        className={`${listing?.post.status === 'available' ? 'bg-green-800' : 'bg-amber-600'}
        py-1 px-2 rounded-sm text-white

        `}

        >{listing?.post.status}</span>
          </div>
      <div className="flex flex-col lg:flex-row items-center justify-between mb-4 ">
        <div className="adminListingCard p-20">
          {isLoading ? (
            <Skeleton className="w-70 h-60 bg-gray-500/20" />
          ) : (
            <Card
              listing={listing?.post}
              edit={true}
            />
          )}
        </div>
        <div className="mt-[-40px] lg:mt-4 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold otherHead mb-4">Listing Agent</h2>
          {listing?.post?.agent ? (
            <Link
              href={`/admin/users/${listing.post.agent._id}`}
              className="flex items-center gap-2 text-darkblue dark:text-coffee hover:underline"
            >
              <CldImage
                src={listing.post.agent.profilePic}
                alt={listing.post.agent.username}
                width={35}
                height={35}
                crop={"auto"}
                gravity="center"
                className="rounded-full"
              />
              <span>{listing.post.agent.username}</span>
            </Link>
          ) : (
            <MoreHorizontal className="w-6 h-6 text-gray-500 animate-pulse" />
          )}

         {listing?.reports.length > 0 
         ? ( <>
            <h2 className="text-xl font-bold otherHead my-6">Reports on this listing</h2>
            <div className="nobar null overflow-y-auto max-h-[400px] w-full">
       
               {listing.reports.map((report: any, i: any) => (
                  <div
                    key={i}
                    className="break-all mx-auto w-[300px] md:w-[450px] lg:w-120 text-white bg-[#7E191B] p-4 rounded-lg mb-2 border-1 border-black"
                  >
                    <p>
                      <strong>Report Details:</strong> {report.message}
                    </p>
                    <p>
                      <strong>Reporter Id:</strong>{" "}
                      <Link href={`/admin/users/${report.sentBy}`}>{report.sentBy}</Link>
                    </p>
                    <div
                      onClick={() => {
                        setCurrentRemoveId((prev) => [...prev, report._id])
                        console.log(currentRemoveId)
                        handleRemoveSingleReport(report._id)
                      }}
                      className="cursor-pointer quickLink"
                    >
                      {currentRemoveId.includes(report._id) ? (
                        <div className="flex items-center">
                          <strong>Removing </strong>
                          <MoreHorizontal className="animate-pulse" />
                        </div>
                      ) : (
                        <strong> Remove This Report </strong>
                      )}
                    </div>
                  </div>
                ))}
             
            
            </div>
            <div className="flex flex-col items-center justify-center mt-2 gap-2">
              <h6 className="text-xs break-words w-90 lg:w-110 font-bold">
                After reviewing all reports and confirming they are false or spam, you may clear
                them here.
              </h6>
              <div
                onClick={handleRemoveAllReports}
                className="clickable flex justify-center bg-darkblue dark:bg-coffee hover:opacity-80 transition-all duration-500
      w-60 shadow-2xs text-white text-sm rounded-md p-2.5  mx-auto cursor-pointer smallScale font-bold"
              >
                {allReportsMutation.isPending ? (
                  <>
                    <span> Clearing </span>
                    <MoreHorizontal className="animate-pulse" />
                  </>
                ) : (
                  "Clear All Reports"
                )}
              </div>
            </div>
          </> )
          : <div> 
            
            { isLoading ? (
                <MoreHorizontal className="w-6 h-6 text-gray-500 animate-pulse mx-auto" />
              ) : (
                    <p> No reports on this listing </p> 
                  )}
              </div>
            }
        </div>
      </div>
    </>
  )
}

export default AdminSingleListing
