"use client"

import { useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
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

const SingleListing = ({ listingId, isAgent }: { listingId: string; isAgent?: boolean }) => {
  const router = useRouter()
  const pathName = usePathname()
  const isAgentView = pathName.includes("/agent/listings/")
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
      <div className={`single-listing-page w-full text-foreground ${isAgentView ? "mt-0" : "mt-16 lg:mt-20"}`}>
        <div className="singleCardCon animate-pulse">
          <div className="singleCardSection">
            <div className="single_card">
              <Skeleton className="h-7 w-28 rounded-full bg-gray-500/20" />
              <Skeleton className="h-[clamp(240px,52vw,520px)] w-full rounded-2xl bg-gray-500/20" />
              <Skeleton className="mt-5 h-7 w-2/5 rounded-md bg-gray-500/20" />
              <Skeleton className="mt-3 h-5 w-4/5 rounded-md bg-gray-500/20" />

              <div className="mt-7 flex flex-wrap items-center justify-center gap-4 border-y border-border/50 py-5 sm:justify-between sm:px-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <Skeleton className="h-8 w-8 rounded-lg bg-gray-500/20" />
                    <Skeleton className="h-4 w-24 rounded-md bg-gray-500/20" />
                  </div>
                ))}
              </div>

              <Skeleton className="mt-5 h-12 w-full rounded-xl bg-gray-500/20" />
            </div>
          </div>

          <div className="singleCardSection">
            <div className="single_card">
              <div className="flex flex-col items-start gap-4">
                <Skeleton className="h-8 w-32 rounded-full bg-gray-500/20" />
                <Skeleton className="h-12 w-52 rounded-md bg-gray-500/20" />
                <Skeleton className="h-4 w-32 rounded-md bg-gray-500/20" />
                <Skeleton className="h-4 w-24 rounded-md bg-gray-500/20" />
              </div>

              <div className="mt-7 flex items-center gap-3 border-t border-border/50 pt-5">
                <Skeleton className="h-9 w-9 rounded-full bg-gray-500/20" />
                <Skeleton className="h-4 w-40 rounded-md bg-gray-500/20" />
              </div>

              <div className="mt-7 border-t border-border/50 pt-6">
                <Skeleton className="h-6 w-36 rounded-md bg-gray-500/20" />
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-4 w-4/5 rounded-md bg-gray-500/20" />
                  <Skeleton className="h-4 w-3/5 rounded-md bg-gray-500/20" />
                  <Skeleton className="h-10 w-full rounded-xl bg-gray-500/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="singleCardCon2 single-listing-page__lower bg-background text-foreground">
          <div className="singleCardSection">
            <div className="single_card">
              <Skeleton className="mx-auto h-7 w-32 rounded-md bg-gray-500/20" />
              <div className="mt-5 space-y-3">
                <Skeleton className="h-4 w-full rounded-md bg-gray-500/20" />
                <Skeleton className="h-4 w-11/12 rounded-md bg-gray-500/20" />
                <Skeleton className="h-4 w-4/5 rounded-md bg-gray-500/20" />
              </div>
            </div>
          </div>

          <div className="singleCardSection">
            <div className="single_card">
              <Skeleton className="mx-auto h-7 w-28 rounded-md bg-gray-500/20" />
              <Skeleton className="mt-5 h-24 w-full rounded-xl bg-gray-500/20" />
            </div>
          </div>
        </div>
      </div>
    )

  if (isError)
    return (
      <div className="flex flex-col text-sm p-6 items-center justify-center text-red-600 w-full min-h-screen bg-black">
        <span>
          An error occurred due to issues with your network or because the page no longer exists.
        </span>
      </div>
    )

  const listing = data?.post

  return (
    <>
      <div
        className={`single-listing-page text-foreground ${
          isAgentView ? "singleCardCon -mt-10 lg:mt-[4px]" : "singleCardCon mt-16 lg:mt-20"
        }`}
      >
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
            {session?.user?.id === listing?.agent?._id ? (
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
                  listingId={listingId}
                  agent={listing?.agent}
                  session={session}
                  onPhone={() => window.open(`tel:${listing?.agent?.phone}`)}
                  onChat={() => router.push(`/chat?receiverId=${listing?.agent?._id}`)}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="singleCardCon2 description single-listing-page__lower bg-gray-50 dark:bg-gray-700/30 text-foreground">
        {/* Tags */}
        {listing?.tags && listing.tags.length > 1 && (
          <div className="singleCardSection">
            <div className="single_card">
              <div className="heading mx-auto self-center">Tags</div>
              <div className="font-medium font-list w-[90%] md:w-[80%] lg:w-[70%] text-foreground text-sm tracking-wide text-justify description mx-auto whitespace-prewrap self-center">
                <div className="flex items-center justify-start p-0 flex-wrap gap-2 mt-2 ml-0">
                  {listing?.tags &&
                    listing?.tags.length > 0 &&
                    listing?.tags?.map((tag: any) => (
                      <span
                        key={tag}
                        className={`
    px-6 py-2 rounded-lg text-xs font-semibold capitalize
    ${
      tag.includes("new") || tag.includes("free")
        ? "bg-green-200 dark:bg-green-300 text-green-700 dark:text-green-800 border border-green-200"
        : tag.includes("walk") || tag.includes("trek")
          ? "bg-yellow-200 text-yellow-700 border border-yellow-200 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700/70"
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
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="singleCardSection">
          <div className="single_card">
            <div className="heading mx-auto self-center">Description</div>
            <div className="font-medium font-list w-[90%] md:w-[80%] lg:w-[70%] text-foreground text-sm tracking-wide text-justify description mx-auto whitespace-prewrap self-center">
              {listing.description}
            </div>
          </div>
        </div>

        <CommentsSection
          listingId={listingId}
          commentsQuery={commentsQuery}
          isAgent={isAgent}
        />
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
