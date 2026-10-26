"use client"
import { useEffect, useState } from "react"
import { CldImage } from "next-cloudinary"
import { Trash, Loader2, Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import { formatNumber } from "@utils/formatNumber"
import { truncateText } from "@utils/truncateText"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useToast } from "@utils/Toast"
import { usePathname } from "next/navigation"

interface WishListProps {
  listing: Listing
  wishlistId: string
  refValue: any
}

const WishListCard = ({ listing, wishlistId, refValue }: WishListProps) => {
  const queryClient = useQueryClient()
  const { setToastValues } = useToast()

  const deleteWishList = async (val: { wishlistId: string; listingId: string | undefined }) => {
    try {
      await axiosdata.value.delete(`/api/listings/wishlists`, { data: val })
      setToastValues({
        isActive: true,
        message: "Removed from wishlist",
        status: "success",
      })
    } catch (err) {
      setToastValues({
        isActive: true,
        message: "Failed to remove from wishlist",
        status: "danger",
      })
    }
  }

  const deleteWishListMutation = useMutation({
    mutationFn: deleteWishList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlists"] })
    },
  })

  const handleDeleteWishList = () => {
    deleteWishListMutation.mutate({ wishlistId, listingId: listing._id })
  }

  return (
    <>
      <div
        ref={refValue}
        className="group flex w-full max-w-4xl items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-2 pr-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0881a3]/35 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/80"
      >
        <Link href={`/listings/single_listing?id=${listing._id}`} className="relative shrink-0 overflow-hidden rounded-xl">
          <CldImage
            width={110}
            height={90}
            alt="post_img"
            src={listing.mainImage}
            crop="auto"
            gravity="center"
            className="ml-0 rounded-xl object-cover transition duration-300 group-hover:brightness-90"
          />
        </Link>
        <div className="min-w-0 flex-1 space-y-1">
          {/* address */}
          <div
            className="address truncate text-sm font-bold"
          >
            <span className="md:hidden">{truncateText(listing.address, 16)}</span>
            <span className="hidden md:block">{truncateText(listing.address, 26)}</span>
          </div>

          {/* school */}
          <div
            className="truncate text-xs font-semibold text-gray-500 dark:text-gray-300"
          >
            {listing.school}
          </div>

          {/* agent */}
          <div className="flex items-center gap-2 pt-1">
            <CldImage
              width={30}
              height={30}
              alt="post_img"
              src={listing.agent.profilePic}
              crop="auto"
              gravity="center"
              className="rounded-full"
            />
            <Link
              href={`/chat?receiverId=${listing.agent._id}?listingId=${listing._id}`}
              className="truncate text-xs font-bold quickLink underline md:text-sm"
            >
              Chat With Agent{" "}
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-center gap-2">
          {/* price and status */}

          <div className="text-right text-sm font-bold text-gray-500 dark:text-gray-300">
            <div className="text-center">&#8358;{formatNumber(Number(listing.price))}</div>
            <div>
              <div
                className={`${
                  listing.status === "available" ? "bg-green-500" : "bg-amber-500"
                } capitalize text-gray-100 text-center text-sm px-2 rounded-md`}
              >
                {listing.status}
              </div>
            </div>
          </div>

          {/* delete btn */}
          <div
            onClick={handleDeleteWishList}
            className="ml-auto pr-6 cursor-pointer smallScale"
          >
            {!deleteWishListMutation.isPending ? (
              <Trash className="text-red-800 dark:text-white" />
            ) : (
              <Loader2
                className="text-red-800
          dark:text-white animate-spin"
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export const WishlistButton = ({
  listingId,
  isInWishList,
}: {
  listingId: string
  isInWishList: boolean
}) => {
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const { setToastValues } = useToast()
  const [liked, setLiked] = useState(isInWishList)

  useEffect(() => {
    setLiked(isInWishList)
  }, [isInWishList])

  const addToWishList = async ({ listingId, shouldRemove }: { listingId: string; shouldRemove: boolean }) => {
    const response = shouldRemove
      ? await axiosdata.value.delete(`/api/listings/wishlists`, { data: { listingId } })
      : await axiosdata.value.post("/api/listings/wishlists", { listingId })

    return {
      message: response?.data?.message || (shouldRemove ? "Removed from wishlist" : "Added to wishlist"),
      status: response.status,
    }
  }

  const addToWishListMutation = useMutation({
    mutationFn: addToWishList,
    onMutate: (variables) => {
      const previousLiked = liked
      setLiked(!variables.shouldRemove)
      return { previousLiked }
    },
    onError: (error: any, _variables, context) => {
      setLiked(context?.previousLiked ?? liked)
      const message = error?.response?.data?.message || "Failed to update wishlist"
      setToastValues({
        isActive: true,
        message,
        status: message.toLowerCase().startsWith("log") ? "warning" : "danger",
        duration: 2000,
      })
    },
    onSuccess: (result) => {
      setToastValues({
        isActive: true,
        message: result.message,
        status: result.status >= 200 && result.status < 300 ? "success" : "danger",
        duration: 2000,
      })
      queryClient.invalidateQueries({ queryKey: ["wishlists"] })
    },
  })

  return (
    <>
      <div
        className={`${pathname.startsWith("/a") && "hidden"}`}
        data-card-action="true"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            addToWishListMutation.mutate({ listingId, shouldRemove: liked })
          }}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
          className={`group/heart relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/55 p-2 shadow-lg backdrop-blur-md transition duration-300 hover:bg-slate-950/75 ${addToWishListMutation.isPending ? "cursor-wait" : ""}`}
        >
          <Sparkles className="pointer-events-none absolute h-4 w-4 text-[#f7b657] opacity-0 transition duration-300 group-active/heart:animate-ping group-active/heart:opacity-100" />
          <Heart size={23} className={`relative z-10 transition duration-300 group-active/heart:scale-125 ${liked ? "fill-red-500 text-red-300" : "fill-white/20 text-white"}`} />
        </button>
      </div>
    </>
  )
}

export default WishListCard
