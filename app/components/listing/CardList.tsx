"use client"

import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { CardProps } from "./Card"
import Card from "./Card"
import Pagination from "../Pagination"
import { Skeleton } from "../ui/skeleton"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useGetListings } from "@lib/customApi"

type CardListProps = {
  limit?: number
  filters: {
    location: string
    school: string
    minPrice: string
    maxPrice: string
    beds: string
    baths: string
    toilets: string
    category?: "student" | "residential" | ""
  }
  page: string
}

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 pt-8 pb-16 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
        <Image
          src="/icons/noListings.svg"
          width={80}
          height={80}
          alt="No listings available"
          className="object-contain"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          No Listings Available
        </h3>

        <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          We couldn't find any properties here just yet. Try adjusting your filters or check back
          later for new listings.
        </p>
      </div>
    </div>
  )
}

const CardList = ({ limit = 12, filters, page }: CardListProps) => {
  useSignals()

  const { data, isLoading, isError } = useGetListings({
    limit,
    page,
    location: filters.location,
    school: filters.school,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    beds: filters.beds,
    baths: filters.baths,
    toilets: filters.toilets,
    status: "available", // only fetch available listings,
    category: filters.category || undefined,
  })

  // check which listings are in wishlist
  const { data: wishlistMap } = useQuery({
    queryKey: ["wishlists", data?.posts?.map((l: CardProps["listing"]) => l._id).join(",")],
    queryFn: () =>
      axiosdata.value
        .post("/api/listings/wishlists/check", {
          listingIds: data?.posts.map((l: CardProps["listing"]) => l._id),
        })
        .then((res) => res.data),
    enabled: !!data?.posts,
  })

  const mapCards = data?.posts?.map((item: CardProps["listing"]) => (
    <Card
      key={item._id}
      listing={item}
      edit={false}
      isInWishList={item?._id ? wishlistMap?.[item._id] : false}
    />
  ))

  const loadingCards = Array.from({ length: 6 }).map((_, i) => (
    <Skeleton
      className="bg-gray-500/20 w-70 h-80 mt-5 mb-1 rounded-xl"
      key={i}
    />
  ))

  if (isError) {
    return (
      <div className="w-full h-40  text-red-500  flex justify-center items-center">
        Failed to load listings
      </div>
    )
  }

  return (
    <>
      <div className="card_list">
        {isLoading ? loadingCards : data?.posts?.length ? <>{mapCards}</> : <NotFound />}
      </div>
      {data?.posts?.length && (
        <Pagination
          currentPage={Number(data?.cursor)}
          totalPages={Number(data?.numOfPages)}
        />
      )}
    </>
  )
}

export default CardList
