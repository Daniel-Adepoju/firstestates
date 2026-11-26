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
import SingleListingNav from "./SingleListingNav"

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
      <div className={`single-listing-page pb-24 w-full text-foreground ${isAgentView ? "mt-0" : "mt-4 lg:mt-6"}`}>
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
        {/* <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:fixed md:bottom-5 md:left-1/2 md:top-auto md:w-[min(96%,1100px)] md:-translate-x-1/2 md:rounded-2xl md:border">
          <div className="mx-auto flex max-w-6xl items-center gap-1 md:gap-2">
            {Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className={`${index > 2 ? "h-11 flex-1" : "h-11 w-11"} rounded-2xl bg-gray-500/20`} />)}
          </div>
        </div> */}
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
    <div className="single-listing-shell box-border w-full px-1 sm:px-2 lg:px-3 pb-18 md:pb-30">
      <div
        className={`single-listing-page pb-28 text-foreground md:pb-0 ${
          isAgentView ? "singleCardCon -mt-2 lg:mt-2" : "singleCardCon mt-4 lg:mt-6"
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

      <div className="singleCardCon2 description single-listing-page__lower bg-transparent pb-28 text-foreground md:pb-40 lg:pb-48">
        {/* Tags */}
        {listing?.tags && listing.tags.length > 1 && (
          <div className="singleCardSection listing-soft-section">
            <div className="single_card listing-soft-card">
              <div className="heading listing-section-heading mx-auto self-center">Tags</div>
              <div className="font-medium font-list w-full text-foreground text-sm tracking-wide description mx-auto whitespace-prewrap self-center">
                <div className="flex items-center justify-start p-0 flex-wrap gap-2 mt-4 ml-0">
                  {listing?.tags &&
                    listing?.tags.length > 0 &&
                    listing?.tags?.map((tag: any) => (
                      <span
                        key={tag}
                        className={`
    rounded-full border px-4 py-2 text-xs font-semibold capitalize tracking-wide
    ${
      tag.includes("new") || tag.includes("free")
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : tag.includes("walk") || tag.includes("trek")
          ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          : tag.includes("female")
            ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            : tag.includes("male")
              ? "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300"
              : "border-primary/15 bg-primary/5 text-primary dark:text-sky-200"
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
        <div className="singleCardSection listing-soft-section">
          <div className="single_card listing-soft-card">
            <div className="heading listing-section-heading mx-auto self-center">Description</div>
            <div className="font-medium font-list w-full text-foreground text-sm tracking-wide description mx-auto whitespace-pre-wrap self-center">
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
      <SingleListingNav listing={listing} session={session} router={router} reportModalRef={reportModalRef} />
    </div>
  )
}

export default SingleListing
