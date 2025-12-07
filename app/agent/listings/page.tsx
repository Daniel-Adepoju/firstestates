"use client"

import Card from "@components/listing/Card"
import { useEffect, useState } from "react"
import { Skeleton } from "@components/ui/skeleton"
import { CardProps } from "@components/listing/Card"
import { useGetAgentListings } from "@lib/customApi"
import { useSearchParams, useRouter } from "next/navigation"
import Pagination from "@components/Pagination"
import Searchbar from "@components/Searchbar"
import { useSignals, useSignal } from "@preact/signals-react/runtime"
import { useChangeHash } from "@lib/useIntersection"
import { formatNumber } from "@utils/formatNumber"
import { useUser } from "@utils/user"
import ListingStats from "@/components/agent/listings/ListingStats"
import ListingActions from "@components/agent/listings/ListingActions"
import SortFilters from "@components/agent/listings/SortFilters"

const AgentListings = () => {
  useSignals()

  const { session } = useUser()
  const agentId = session?.user.id
  const params = useSearchParams()
  const router = useRouter()
  const limit = 10
  const page = params.get("page") || "1"
  const [selected, setSelected] = useState("edit")
  const [search, setSearch] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const debounced = useSignal("")
  const searchParams = new URLSearchParams(params.toString())
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [selectedSortOpen, setSelectedSortOpen] = useState([0])

  const sortOptions: any = [
    { label: "Date", key: "date", options: ["newest", "oldest"] },
    { label: "Views", key: "views", options: ["all", "highest", "lowest"] },
    { label: "Status", key: "status", options: ["all", "available", "rented"] },
  ]

  const [sortValues, setSortValues] = useState<any>({
    status: "all",
    date: "newest",
    views: "all",
  })

  const [confirmSortValues, setConfirmSortValues] = useState({
    status: sortValues.status,
    date: sortValues.date,
    views: sortValues.views,
  })

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
    date: confirmSortValues.date,
    views: confirmSortValues.views,
    status: confirmSortValues.status,
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

  const openSelectOption = (index: number) => {
    setSelectedSortOpen((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <>
      <ListingStats
        data={data}
        formatNumber={formatNumber}
      />

      {/* ADD LISTING + MANAGE RESIDENTS */}
      <ListingActions
        showAdd={showAdd}
        session={session}
      />

      <div className="w-full flex flex-col items-center gap-4">
        {/* SEARCH */}
        <Searchbar
          search={search}
          setSearch={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="dark:text-white mt-[-19px] gap-1 w-full flex flex-row justify-center items-center md:justify-end md:w-[60%]"
          placeholder={"Search for your listings"}
        />

        {/* SORT COMPONENT */}
        <SortFilters
          sortOptions={sortOptions}
          sortValues={sortValues}
          setSortValues={setSortValues}
          isSortOpen={isSortOpen}
          setIsSortOpen={setIsSortOpen}
          setConfirmSortValues={setConfirmSortValues}
          confirmSortValues={confirmSortValues}
          selectedSortOpen={selectedSortOpen}
          openSelectOption={openSelectOption}
        />

        {/* LISTINGS */}
        
        {/* <div
          ref={hashRef}
          id="listings"
          className="availableLists shadow-md dark:shadow-black/80 shadow-gray-200"
        >
          <div className="header border-b-2 border-gray-500/20 dark:border-gray-500/50">
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
        </div> */}


      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={Number(data?.cursor)}
        totalPages={Number(data?.numOfPages)}
        hashParams="#listings"
      />
    </>
  )
}

export default AgentListings
