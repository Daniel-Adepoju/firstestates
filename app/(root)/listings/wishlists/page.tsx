'use client'
import WishListCard from "@components/WishListCard"
import { useGetWishLists } from "@lib/customApi"
import { Skeleton } from "@components/ui/skeleton"
import { FileX } from "lucide-react"
import { Loader2 } from "lucide-react"
import { useNextPage } from "@lib/useIntersection"
import { useQuery } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import Link from "next/link"
import { CldImage } from "next-cloudinary"
import { Heart } from "lucide-react"

const WishLists = () => {
  const {data,isLoading,isFetchingNextPage,fetchNextPage,hasNextPage} = useGetWishLists({
    page: '1',
    limit: 10,
  })
  const ref = useNextPage({isLoading,hasNextPage,fetchNextPage})
  const { data: savedAgents } = useQuery({
    queryKey: ["saved-agents"],
    queryFn: () => axiosdata.value.get("/api/agents/saved").then((response) => response.data.agents),
  })
 
  if (isLoading) {
    return <div className="mt-14 w-full flex flex-col gap-4 p-4">
        {Array.from({length: 4}).map((_,index) => (
            <div key={index} className="w-full ">
            <Skeleton className="w-full max-w-200 h-20 rounded-md bg-gray-500/20" />
            </div>
        ))}
      
    </div>
  }
  return (
    <div className="w-full mt-26 p-4">
      <section className="mb-10 w-full max-w-220">
        <div className="mb-4 flex items-center gap-2">
          <Heart className="text-red-500" />
          <h2 className="text-xl font-bold">Saved Agents</h2>
        </div>
        {savedAgents?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {savedAgents.map((agent: any) => (
              <Link key={agent._id} href={`/agent-view/${agent._id}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-background p-3 transition hover:border-primary/50">
                <CldImage width={48} height={48} crop="fill" src={agent.profilePic || "firstestatesdefaultuserpicture"} alt="" className="h-12 w-12 rounded-full object-cover" />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{agent.username}</span>
                  <span className="block text-xs text-muted-foreground">{agent.activeListingCount} active listings</span>
                </span>
              </Link>
            ))}
          </div>
        ) : <p className="text-sm text-muted-foreground">You have not saved any agents yet.</p>}
      </section>
      {/* <div>WishLists</div> */}
      {data?.pages[0]?.wishlist.length < 1 ?
       <div className="flex flex-col items-center gap-4 mt-[140px] mx-auto md:mt-10"> 
         <FileX size={100} color='#f29829'/>
        <div className="text-gray-500  dark:text-gray-300">
        You have no listing in your wishlist 
        </div>
        </div>
      : 
      <div className="w-full max-w-220 flex flex-col items-start gap-2">
     {data?.pages.flatMap((items) => {
      return (
        items?.wishlist?.flatMap((wishlist: {listing:Listing,_id:string},index:number) => (
          <WishListCard 
          key={wishlist._id} 
          listing={wishlist.listing}
          wishlistId={wishlist._id}
          refValue={index === items.wishlist.length - 1 ? ref : null}
          />
        ))
    )
     })}
    {isFetchingNextPage && hasNextPage && <Loader2 className='animate-spin mx-auto'/> }

   </div>

     }
    
    </div>
  
  )
}

export default WishLists
