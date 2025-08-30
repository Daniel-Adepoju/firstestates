'use client'
import { useState } from "react"
import { CldImage } from "next-cloudinary"
import { Trash, Loader2, Heart} from "lucide-react"
import Link from "next/link"
import { formatNumber } from "@utils/formatNumber"
import { truncateAddress } from "@utils/truncateAddress"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import Toast from "./Toast"
import { useQuery } from "@tanstack/react-query"

interface WishListProps {
    listing:Listing,
    wishlistId: string,
    refValue: any,
}

const WishListCard = ({listing,wishlistId,refValue}:WishListProps) => {
 const queryClient = useQueryClient()
  const [notification,setNotification] = useState({
    isActive:false,
    message:'',
    status:''
  })


 const deleteWishList = async (val: {wishlistId:string, listingId: string | undefined}) => {
 try {
  await axiosdata.value.delete(`/api/listings/wishlists`,{data:val})
   setNotification({
    isActive:true,
    message:'Removed from wishlist',
    status:'success'
   })
  } catch (err) {
    setNotification({
      isActive:true,
      message:'Failed to remove from wishlist',
      status:'danger'
    })
  } 
}

 const deleteWishListMutation = useMutation({
  mutationFn: deleteWishList,
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['wishlists']})
  }
 })

 const handleDeleteWishList = () => {
   deleteWishListMutation.mutate({wishlistId, listingId:listing._id})
 }



 
  return (
    <> 
     <Toast 
      isActive={notification.isActive}
      setIsActive={setNotification}
      message={notification.message}
      status={notification.status}
     />
    <div
    ref={refValue}
    className="w-full max-w-220 flex items-center gap-4 shadow-sm rounded-md dark:bg-gray-800/50">
      <CldImage
    width={90}
    height={90}
    alt="post_img"
    src={listing.mainImage}
    crop={{
     type: "auto",
       source: true,
        }}
        className="rounded-md"
        />
        <div className="flex flex-col items- enter">

      
        <div className="
        address text-sm">
         {truncateAddress(listing.address)}
        </div>  
     <div className="
      font-bold text-gray-500 dark:text-gray-300 text-sm px-3 py-2">
        {listing.school}
        </div>
        <div className="agent pb-2">
                <CldImage
    width={90}
    height={90}
    alt="post_img"
    src={listing.agent.profilePic}
    crop= "auto"
    className="rounded-full"
        />
        <Link href={`/chat?recipientId=${listing.agent._id}`} className="text-sm text-darkblue dark:text-coffee underline ">Chat With Agent </Link>
        </div>
        </div>


   <div className="text-gray-500 dark:text-gray-300 font-bold text-sm ml-auto">
    <div className="text-center">
    &#8358;{formatNumber(Number(listing.price))}
    </div>
    <div>
    <div className={`${listing.status === 'available' ?'bg-green-500' : 'bg-amber-500'} capitalize text-gray-100 text-center text-sm px-2 rounded-md`}>
        {listing.status}
    </div>
    </div>
   </div>


        <div 
        onClick={handleDeleteWishList}
        className="ml-auto pr-6 cursor-pointer smallScale">
       {!deleteWishListMutation.isPending ?
        <Trash className="text-red-800 dark:text-white"/>
      : <Loader2
         className="text-red-800
          dark:text-white animate-spin"/>
       }
        </div>
    </div>
    </>
  
  )
}

export const WishlistButton = ({listingId,isInWishList}:{listingId:string,isInWishList:boolean}) => {
  const queryClient = useQueryClient()
  const [notification,setNotification] = useState({
    isActive:false,
    message:'',
    status:''
  })

 
  const addToWishList = async (listingId:string) => {
    let res

    try {
      if (isInWishList) {
        console.log('true')
        res = await axiosdata.value.delete(`/api/listings/wishlists`,{data:{listingId}})
      return   setNotification({
        isActive:true,
        message: res?.data.message,
       status: res.status === 201 || res.status === 200 ? "success" : "danger",
      })
      } else {

     res = await axiosdata.value.post('/api/listings/wishlists',{listingId})
      setNotification({
        isActive:true,
        message: res?.data.message,
       status: res.status === 201 ? "success" : "danger",
      })
      
    }
    } catch (err: any) {
      console.log(err.response.data.message)
      if(err.response.data.message.startsWith('Log')) {
        return  setNotification({
        isActive:true,
        message:err.response.data.message,
        status:'warning'
      })
      }
      setNotification({
        isActive:true,
        message:'Failed to add to wishlist',
        status:'danger'
      })
    }
  }

  const addToWishListMutation = useMutation({
    mutationFn: addToWishList,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['wishlists']})
    }
  })

  // if listingId === wishList.listing, then remove from wishlist

  return (
    <>
       <Toast 
      isActive={notification.isActive}
      setIsActive={setNotification}
      message={notification.message}
      status={notification.status}
      />
    <div className="flex items-center justify-center absolute top-2 right-3 z-10">
      <button
        onClick={(e) => {
          e.stopPropagation()
          addToWishListMutation.mutate(listingId)
          }}
          disabled={addToWishListMutation.isPending}
        className="
        w-10 h-10 flex items-center justify-center p-2
        clickable bg-gray-700/60
      hover:bg-gray-700  hover:scale-105 transition-all
         rounded-full"
      >
        {!addToWishListMutation.isPending ? (
          <Heart
           size={30}
           className={!isInWishList ?  "fill-gray-500/40 text-white" : "fill-darkblue dark:fill-coffee text-white"} />

        ) : (
          <Loader2
            size={25}
            className="text-gray-300 dark:text-white animate-spin"
          />
        )}
      </button>
    </div>
    </>
  )
}

export default WishListCard