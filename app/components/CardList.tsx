"use client"

import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { CardProps } from "./Card"
import Card from "./Card"
import Pagination from "./Pagination"
import { Skeleton } from "./ui/skeleton"
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
    status: string
  }
  page: string
}

const CardList = ({ limit = 6, filters, page }: CardListProps) => {
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
    status: filters.status,
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
      className="animate-none bg-gray-500/20 w-70 h-80"
      key={i}
    />
  ))

  if (isError) {
    return <div className="card">Failed to load listings</div>
  }

  return (
    <>
      {isLoading ? (
        <div className="mx-auto my-4 flex flex-wrap gap-10 justify-center">
          {loadingCards}
        </div>
      ) : data?.posts?.length ? (
        <>
          <div className="card_list">{mapCards}</div>
          <Pagination
            currentPage={Number(data?.cursor)}
            totalPages={Number(data?.numOfPages)}
          />
        </>
      ) : (
        <div className="flex items-center error m-6 text-2xl">
          <Image
            src="/icons/noListings.svg"
            width={100}
            height={100}
            alt="icon"
          />
          <div>No Listing Available</div>
        </div>
      )}
    </>
  )
}

export default CardList
