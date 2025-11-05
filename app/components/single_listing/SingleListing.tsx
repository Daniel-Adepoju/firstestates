"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@utils/Toast"
import { useBackdrop } from "@lib/Backdrop"
import { useUser } from "@utils/user"
import { useGetSingleListing, useGetComments, useGetInhabitants } from "@lib/customApi"
import { axiosdata } from "@utils/axiosUrl"
import { Skeleton } from "@components/ui/skeleton"
import { ReportListingModal } from "@components/Modals"

import ListingHeader from "./ListingHeader"
import ListingDetails from "./ListingDetails"
import UserOptions from "./UserOptions"
import InhabitantsSection from "./InhabitantsSection"
import AgentDetails from "./AgentDetails"
import CommentsSection from "./CommentsSection"

const SingleListing = ({ listingId }: { listingId: string }) => {
  const router = useRouter()
  const { setToastValues } = useToast()
  const { session } = useUser()
  const { backdrop, setBackdrop } = useBackdrop()
  const reportModalRef = useRef<HTMLDialogElement>(null)

  // Fetch data
  const { data, isLoading, isError } = useGetSingleListing(listingId)
  const commentsQuery = useGetComments({ listingId, page: "1", limit: 10 })
  const inhabitantsQuery = useGetInhabitants({ listingId, page: "1", limit: 15 })

  // Wishlist mutation
  const wishListMutation = useMutation({
    mutationFn: async (val: { listingId: string | null }) => {
      const res = await axiosdata.value.post("/api/listings/wishlists", val)
      return res
    },
    onSuccess: (res) => {
      setToastValues({
        isActive: true,
        message: res?.data.message,
        status: res.status === 201 ? "success" : "danger",
      })
    },
    onError: (err: any) => {
      setToastValues({
        isActive: true,
        message: err?.response?.data.message,
        status: "danger",
      })
    },
  })

  if (isLoading)
    return (
      <div className="gap-[30px] flex flex-col items-center w-full min-h-screen">
        <Skeleton className="bg-gray-500/20 w-full h-[300px] rounded-4xl" />
        <Skeleton className="bg-gray-500/20 w-[90%] h-[100px] rounded-xl" />
        <Skeleton className=" bg-gray-500/20 w-[80%] h-[190px] rounded-xl" />
      </div>
    )

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center text-red-600 text-xl w-full min-h-screen bg-black">
        An error occurred due to network issues or because the page no longer exists.
      </div>
    )

  const listing = data?.post

  return (
    <>
      <div className="singleCardCon">
        {/*  first singleCardSection */}
        <div className="singleCardSection">
          <div className="single_card">
            {/* contains  gallery /map button */}
            <ListingHeader listing={listing} />
          </div>
        </div>

        {/* second singleCardSection*/}
        {/* contains price, agent, user-options, inhabitants/agent details */}
        <div className="singleCardSection">
          <div className="single_card">

            {/* ListingDetails ->> price/school/agent preview */}
            <ListingDetails listing={listing} />
          
            {/* User options */}
            <UserOptions
              session={session}
              listing={listing}
              router={router}
              onReport={() => reportModalRef.current?.showModal()}
              onWishlist={() => wishListMutation.mutate({ listingId })}
            />

            {/* Inhabitants OR Agent details */}
            {session?.user?.id === listing?.agent?._id && (!session?.user.isTierOne || session?.user.isTierTwo) ? (
              <InhabitantsSection
                session={session}
                listingId={listingId}
                inhabitantsQuery={inhabitantsQuery}
                backdrop={backdrop}
                setBackdrop={setBackdrop}
              />
            ) : (
              session?.user?.id !== listing?.agent?._id && (
                <AgentDetails
                  agent={listing?.agent}
                  session={session}
                  onPhone={() => window.open(`tel:${listing?.agent?.phone}`)}
                  onChat={() => router.push(`/chat?recipientId=${listing?.agent?._id}`)}
                />
              )
            )}
          </div>
        </div>
      </div>

  
      <div className="singleCardCon2">

       <div className="singleCardSection">
        <div className="single_card">
           <div className="heading mt-3 mx-auto self-center">Description</div>
              <div className="description mx-auto whitespace-prewrap self-center">{listing.description}</div>
        </div>
         
       </div>
            
            
        <CommentsSection listingId={listingId} commentsQuery={commentsQuery} />
      </div>

      <ReportListingModal
        ref={reportModalRef}
        userId={session?.user.id ?? ""}
        reportedUser={listing?.agent?._id ?? ""}
        reportedListing={listing?._id ?? ""}
        thumbnail={listing?.mainImage ?? ""}
      />
    </>
  )
}

export default SingleListing
