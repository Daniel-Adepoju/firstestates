"use client"
import WishListCard from "@components/WishListCard"
import { useGetWishLists } from "@lib/customApi"
import { Skeleton } from "@components/ui/skeleton"
import { FileX } from "lucide-react"
import { Loader2 } from "lucide-react"
import { useNextPage } from "@lib/useIntersection"
import { useQuery } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useUser } from "@utils/user"
import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { Heart, UserRound, Building2 } from "lucide-react"

const WishLists = () => {
  const { session, status } = useUser()
  const userId = session?.user?.id
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetWishLists({
    page: "1",
    limit: 10,
  })
  const ref = useNextPage({ isLoading, hasNextPage, fetchNextPage })
  const {
    data: savedAgents = [],
    isLoading: isLoadingAgents,
    isError: isAgentsError,
  } = useQuery({
    queryKey: ["saved-agents", userId],
    queryFn: () =>
      axiosdata.value.get("/api/agents/saved").then((response) => response.data.agents),
    enabled: Boolean(userId),
    staleTime: 30_000,
  })

  const propertyCount =
    data?.pages?.reduce((count, page) => count + (page?.wishlist?.length || 0), 0) || 0
  const isAgentsLoading =
    status === "loading" || (status !== "unauthenticated" && !userId) || isLoadingAgents
  const isPropertiesLoading = isLoading || !data

  return (
    <main className="mx-auto mt-20 w-full px-4 pb-24 sm:px-8 lg:px-12">
      <header className="mb-8 border-b border-border/60 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Your Wishlist
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Saved items</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Keep trusted agents and properties in one place so you can find your next move quickly.
        </p>
      </header>

{/* Saved agents */}
      <section
        aria-labelledby="saved-agents-heading"
        className="w-full mb-10 rounded-2xl border border-border/60 bg-background/70 p-5 shadow-xs sm:p-8"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
              <UserRound
                className="text-sky-500"
                size={20}
              />
            </span>
            <div>
              <h2
                id="saved-agents-heading"
                className="text-xl font-bold"
              >
                Saved agents
              </h2>
              <p className="text-sm text-muted-foreground">Agents you may want to contact again.</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            {savedAgents.length}
          </span>
        </div>

        {isAgentsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[76px] w-full rounded-xl bg-gray-500/20"
              />
            ))}
          </div>
        ) : isAgentsError ? (
          <p className="rounded-xl bg-red-500/5 p-4 text-sm text-muted-foreground">
            Saved agents could not be loaded right now. Please try again shortly.
          </p>
        ) : savedAgents.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {savedAgents.map((agent: any) => (
              <Link
                key={agent._id}
                href={`/agent-view/${agent._id}`}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-background p-3 transition hover:border-primary/50 hover:shadow-sm"
              >
                <CldImage
                  width={100}
                  height={100}
                  crop="fill"
                  src={agent.profilePic || "firstestatesdefaultuserpicture"}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{agent.username}</span>
                  <span className="block text-xs text-muted-foreground">
                    {agent.activeListingCount} active listings
                  </span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-primary">View</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground">
            You have not saved any agents yet. Visit an agent profile to save one.
          </p>
        )}
      </section>

{/* Saved listings */}
      <section aria-labelledby="saved-properties-heading" className="w-full rounded-2xl border border-border/60 bg-background/70 p-5 shadow-xs sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Building2
                className="text-primary"
                size={20}
              />
            </span>
            <div>
              <h2
                id="saved-properties-heading"
                className="text-xl font-bold"
              >
                Saved listings
              </h2>
              <p className="text-sm text-muted-foreground">
                Listings you bookmarked for a closer look.
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            {propertyCount}
          </span>
        </div>

        {isPropertiesLoading ? (
          <div className="flex w-full flex-col gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-24 w-full rounded-xl bg-gray-500/20"
              />
            ))}
          </div>
        ) : propertyCount < 1 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/70 px-6 py-14 text-center">
            <FileX
              size={64}
              className="text-primary"
            />
            <p className="text-sm text-muted-foreground">You have no saved properties yet.</p>
          </div>
        ) : (
          <div className="flex w-full flex-col items-stretch gap-4">
            {data?.pages?.flatMap((items) =>
              items?.wishlist?.map((wishlist: { listing: Listing; _id: string }, index: number) => (
                <WishListCard
                  key={wishlist._id}
                  listing={wishlist.listing}
                  wishlistId={wishlist._id}
                  refValue={index === (items.wishlist?.length || 0) - 1 ? ref : null}
                />
              )),
            )}
            {isFetchingNextPage && hasNextPage && <Loader2 className="mx-auto animate-spin" />}
          </div>
        )}
      </section>
    </main>
  )
}

export default WishLists
