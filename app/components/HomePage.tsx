"use client"

import { useSignals, useSignal } from "@preact/signals-react/runtime"
import { useSearchParams, useRouter } from "next/navigation"
import Searchbar from "@/components/Searchbar"
import Filter from "@/components/Filter"
import CardList from "@components/listing/CardList"
import PopularThisWeek from "@/components/PopularThisWeek"
import Featured from "@components/listing/Featured"
import {
  ArrowLeftFromLine,
  ChevronDownCircle,
  ChevronUpCircle,
  ChevronRightCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

const HomePage = () => {
  useSignals()
  const router = useRouter()
  const page = useSearchParams().get("page") || "1"
  const isSecondPage = Number(page) >= 2

  // filters
  const location = useSignal("")
  const school = useSignal("")
  const minPrice = useSignal("")
  const maxPrice = useSignal("")
  const beds = useSignal("")
  const baths = useSignal("")
  const toilets = useSignal("")
  const statusVal = useSignal("")
  const active = useSignal(false)
  const search = useSignal("")
  const placeholder = useSignal("Search by school or location")

  return (
    <main className="w-full flex flex-col items-center">
      {/* Searchbar + Filter toggle */}
      <div className="w-full flex flex-col justify-center items-center md:items-end md:pr-2">
        <Searchbar
          search={search.value}
          setSearch={() => (search.value = "")}
          placeholder={placeholder.value}
          className="mt-3 gap-1.5 w-full flex flex-row justify-center items-center md:justify-end md:w-[60%]"
          goToSearch={() => {
            placeholder.value = "Redirecting to search page..."
            router.push("/search")
          }}
        />

        {/* Filter toggle button */}
        <div
          onClick={() => (active.value = !active.value)}
          className="dark:bg-darkGray flex items-center justify-center bg-white w-80 border border-gray-400 py-3 px-2 shadow-xs my-4 cursor-pointer rounded-md"
        >
          <span className="font-semibold text-gray-500 dark:text-gray-300 pl-2">
            Filter Listings
          </span>

          <ChevronDownCircle
            className={`w-6 h-6 text-gray-500 dark:text-gray-300 
              ml-auto ${active.value ? "rotate-180" : "rotate-0"} transition-all duration-250`}
          />
        </div>
      </div>

      {/* Filter dropdown */}
      <Filter
        statusVal={statusVal}
        selectedSchool={school}
        selectedArea={location}
        minPrice={minPrice}
        maxPrice={maxPrice}
        beds={beds}
        baths={baths}
        toilets={toilets}
        active={active}
      />

      {/* Conditional sections */}
      {!isSecondPage ? (
        <>
          <PopularThisWeek />
          <Featured />
        </>
      ) : (
        <Link
          href="/"
          className="flex flex-row gap-2 mt-2 mx-1 px-4 py-1.5 items-center self-center md:self-end
          dark:text-gray-400 text-gray-500 dark:bg-darkGray bg-gray-200 rounded-lg hover:text-gray-900 dark:hover:text-gray-200 transition-all"
        >
          <ArrowLeftFromLine size={30} />
          Return To Homepage
        </Link>
      )}

      {/* Section header */}
      <div className="subheading ml-4 p-1 w-full">
        <div>
          Recent Listings from {school.value ? "" : "all "}
          <span className="capitalize inline-flex items-center gap-1">
            {school.value || "schools"}
            <ChevronRightCircle className="w-6 h-6" />
          </span>
        </div>
      </div>

      {/* Card List */}
      <CardList
        page={page}
        filters={{
          location: location.value,
          school: school.value,
          minPrice: minPrice.value,
          maxPrice: maxPrice.value,
          beds: beds.value,
          baths: baths.value,
          toilets: toilets.value,
          status: statusVal.value,
        }}
      />
    </main>
  )
}

export default HomePage
