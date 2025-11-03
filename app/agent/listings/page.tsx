"use client"

import Card from "@components/Card"
import { useEffect, useState } from "react"
import { Skeleton } from "@components/ui/skeleton"
import Link from "next/link"
import { CardProps } from "@components/Card"
import { useGetAgentListings } from "@lib/customApi"
import { useSearchParams, useRouter } from "next/navigation"
import Pagination from "@components/Pagination"
import Searchbar from "@components/Searchbar"
import { useSignals, useSignal } from "@preact/signals-react/runtime"
import { useChangeHash } from "@lib/useIntersection"
import { HousePlus, MoreHorizontal, PlusCircle } from "lucide-react"
import { formatNumber } from "@utils/formatNumber"
import { useUser } from "@utils/user"

const AgentListings = () => {
  useSignals()
  const { session } = useUser()
  const agentId = session?.user.id
  const params = useSearchParams()
  const router = useRouter()
  const limit = 10
  const page = params.get("page") || "1"
  const [selected, setSelected] = useState("edit")
  const [search, setSearch] = useState<string>("")
  const [showAdd, setShowAdd] = useState(false)
  const debounced = useSignal("")
  const searchParams = new URLSearchParams(params.toString())

  useEffect(() => setShowAdd(true), [])

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        searchParams.set("page", "1")
        if (search) router.push(`?${searchParams.toString()}#listings`)
        debounced.value = search ?? ""
      }, 560)
      return () => clearTimeout(timeoutId)
    }, [search])

    const { data, isLoading } = useGetAgentListings({
      id: agentId,
      enabled: !!agentId,
      page,
      limit,
      school: debounced.value,
      location: debounced.value,
    })

    const mapCards = data?.listings?.map((item: CardProps["listing"]) => (
      <Card
        key={item._id}
        listing={item}
        isAgentCard
        edit={selected === "edit"}
      />
    ))

  const hashRef = useChangeHash()

  return (
    <>
      {/* Listing Stats */}
      <div className="adminDashboard_content grid grid-cols-1 md:grid-cols-2 gap-4 dark:text-white self-center">
        <div className="content_item banner full">
          <h3>Renting</h3>
          <div className="text">
            <span>{formatNumber(data?.currentRentings ?? "0")}</span>
          </div>
        </div>
        <div className="content_item banner full">
          <h3>Current Listings</h3>
          <div className="text">
            <span>{formatNumber(data?.currentListings ?? "0")}</span>
          </div>
        </div>
      </div>

      {/* Listing and residency actions */}
      <div className="w-full flex flex-col md:flex-row gap-4 lg:gap-18 items-center justify-center my-3 pb-4 text-foreground">
        {/* Add Listing */}
        {showAdd ? (
          <Link
            href={"/agent/listings/add"}
            className="flex items-center justify-center gap-3 dark:text-white dark:bg-[#31363F] border-[1.38px] border-gray-300 dark:border-gray-500 p-3 rounded-2xl w-64 shadow-xs mediumScale"
          >
            <PlusCircle
              size={40}
              className="text-[#f29829] rounded-full animate-glass"
            />
            <span className="font-head text-gray-600 dark:text-gray-200">Add New Listing</span>
          </Link>
        ) : (
          <MoreHorizontal
            size={36}
            className="animate-pulse text-gray-500 dark:text-white"
          />
        )}

        {/* Manage Residency */}
       {(!session?.user.tierOne || session?.user.tierTwo)  && (
        <Link
          href="/agent/listings/residents"
          className="flex items-center justify-center gap-3 dark:text-white dark:bg-[#31363F] border-[1.38px] border-gray-300 dark:border-gray-500 p-3 rounded-2xl w-64 shadow-xs mediumScale"
        >
          <HousePlus
            size={40}
            className="text-[#f29829]  rounded-full animate-glass"
          />
          <span className="font-head text-gray-600 dark:text-gray-200">Manage Residents</span>
        </Link>
       )}
      </div>

      {/* Listings */}
      <div className="w-full flex flex-col items-center gap-4">
        <Searchbar
          search={search}
          setSearch={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="dark:text-white mt-[-19px] gap-1 w-full flex flex-row justify-center items-center md:justify-end md:w-[60%] "
          placeholder={"Search for your listings"}
        />
        <div
          ref={hashRef}
          id="listings"
          className="availableLists"
        >
          <div className="header">
            <div
              onClick={() => setSelected("view")}
              className={`${selected === "view" && "active"} subheading`}
            >
              View Listings
            </div>
            <div
              onClick={() => setSelected("edit")}
              className={`${selected === "edit" && "active"} subheading`}
            >
              Edit Listings
            </div>
          </div>

          {!agentId || isLoading ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-70 h-70 bg-gray-500/20 animate-none"
                />
              ))}
            </div>
          ) : (
            mapCards
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={Number(data?.cursor)}
        totalPages={Number(data?.numOfPages)}
        hashParams="#listings"
      />
    </>
  )
}

export default AgentListings
