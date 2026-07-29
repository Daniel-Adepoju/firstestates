"use client"

import { useEffect, useState } from "react"
import Card from "@components/listing/Card"
import { useGetPopularListings, useSearchListings } from "@lib/customApi"
import Searchbar from "@components/Searchbar"
import { useRouter, useSearchParams } from "next/navigation"
import Pagination from "@components/Pagination"
import { formatNumber } from "@utils/formatNumber"
import PopularCard from "@components/listing/PopularCard"
import { Skeleton } from "@components/ui/skeleton"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const AdminListings = () => {
  const [search, setSearch] = useState<string>("")
  const [debounced, setDebounced] = useState<string>("")
  const params = useSearchParams()
  const searchParams = new URLSearchParams(params.toString())
  const [page, setPage] = params.get("page") || "1"
  const router = useRouter()
  const [tab, setTab] = useState("all")

  const { data, isLoading } = useSearchListings({
    page,
    limit: 10,
    search: debounced,
    agentName: debounced,
    isAdmin: true,
    isPendingSpecific: tab === "pending",
    enabled: true,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      searchParams.set("page", "1")
      if (search) {
        router.push(`?${searchParams.toString()}#listings`)
      }
      setDebounced(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const mapCards = data?.posts.map((listing: Listing) => (
    <Card
      key={listing._id}
      listing={listing}
      edit={true}
      isAdmin={true}
    />
  ))

  const LoaderComponent = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <Skeleton
        key={i}
        className="w-60 h-50 mb-4 animate-none bg-gray-500/20"
      />
    ))
  }
  const LoaderComponentMain = () => {
    return Array.from({ length: 8 }).map((_, i) => (
      <Skeleton
        key={i}
        className="w-75 h-60 mb-4 animate-none bg-gray-500/20"
      />
    ))
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        <h1 className="text-2xl font-bold mb-4 otherHead">Stats</h1>
        <div className="adminDashboard_content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center  justify-center gap-4">
          <div className="content_item banner">
            <h3>Total Listings</h3>
            <div className="text">
              <span>{formatNumber(data?.totalListings ?? "0")}</span>
            </div>
          </div>

          <div className="content_item banner">
            <h3>Rented Listings</h3>
            <div className="text">
              <span>{formatNumber(data?.rentedListings ?? "0")}</span>
            </div>
          </div>

          <div className="content_item banner danger">
            <h3>Reported Listings</h3>
            <div className="w-full flex items-center justify-center gap-6">
              <div className="text">
                <span>{formatNumber(data?.reportedListings ?? "0")}</span>
              </div>
              <Link href="/admin/listings/reported">
                <ArrowRight className="bg-red-600 text-white w-10 h-10 p-2 rounded-full cursor-pointer smallScale" />
              </Link>
            </div>
          </div>
        </div>

        <Searchbar
          placeholder="Search by school, location or agent"
          search={search}
          setSearch={(e) => setSearch(e.target.value)}
          className="mt-[10px] gap-1 w-full flex flex-row justify-center items-center  md:w-[60%]"
        />

        <div
          id="listings"
          className="w-full flex  items-center justify-center gap-15 mt-1"
        >
          <span
            onClick={() => setTab("all")}
            className={`mt-4 text-md font-bold font-head text-foreground mb-1 cursor-pointer transition-colors ease-out duration-200 ${tab === "all" && "text-goldPrimary"}`}
          >
            All Listings
          </span>
          <span
            onClick={() => setTab("pending")}
            className={`mt-4 text-md font-bold font-head text-foreground mb-1 cursor-pointer transition-colors ease-out duration-200 ${tab === "pending" && "text-goldPrimary"}`}
          >
            Pending Listings
          </span>
        </div>

        <div className="mt-4 w-full flex flex-col items-center justify-center gap-4">
          {!isLoading ? (
            <div className="adminListingCard w-[97%] flex flex-wrap items-center justify-center gap-4">
              {mapCards.length > 0 ? (
                mapCards
              ) : (
                <div className="flex flex-row items-center gap-1">
                  <Image
                    src="/icons/noListings.svg"
                    alt="No listings found"
                    width={60}
                    height={60}
                  />
                  <p className="text-gray-500 dark:text-gray-200">No listings found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-row gap-3 flex-wrap items-center justify-center w-full">
              <LoaderComponentMain />
            </div>
          )}
        </div>

        <Pagination
          currentPage={Number(data?.cursor)}
          totalPages={data?.numOfPages || 1}
        />
      </div>
    </>
  )
}

export default AdminListings
