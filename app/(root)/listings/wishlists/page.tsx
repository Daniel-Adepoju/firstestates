'use client'
import WishListCard from "@components/WishListCard"
import { useGetWishLists } from "@lib/customApi"
import { Skeleton } from "@components/ui/skeleton"
import { FileX } from "lucide-react"
import { Loader2 } from "lucide-react"
import { useNextPage } from "@lib/useIntersection"

const WishLists = () => {
  const {data,isLoading,isFetchingNextPage,fetchNextPage,hasNextPage} = useGetWishLists({
    page: '1',
    limit: 10,
  })
  const ref = useNextPage({isLoading,hasNextPage,fetchNextPage})
 
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