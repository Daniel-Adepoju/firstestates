"use client"
import { useSignals, useSignal } from "@preact/signals-react/runtime"
import { useSearchParams } from "next/navigation"
import Filter from "@/components/Filter"
import CardList from "@components/listing/CardList"
import PopularThisWeek from "@/components/PopularThisWeek"
import Featured from "@components/listing/Featured"
import {
  ArrowLeftFromLine,
  ChevronDownCircle,
  MapPin,
  Sparkles,
  Search,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

const HomePage = () => {
  useSignals()
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
  const active = useSignal(false)

  return (
    <main className="w-full flex flex-col items-center">
      {/* Searchbar + Filter toggle */}
      <div className="w-full flex flex-col justify-center items-center md:items-end md:pr-2">
        <div className="mt-4 flex w-full max-w-2xl flex-col gap-3 px-4 sm:flex-row sm:justify-center">
    

          <Link
            href="/search"
            className="w-[70%] mx-auto group flex flex-1 items-center gap-3 rounded-2xl
            dark:bg-darkGray bg-white outline-2 outline-slate-200 dark:outline-gray-800
             border border-border/70 p-3
              text-left shadow-sm transition-all
               duration-200 hover:-translate-y-0.2 hover:opacity-80">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-goldPrimary/15 text-goldPrimary">
              <Search size={21} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">Search listings</span>
              <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                Browse with standard filters.
              </span>
            </span>
            <ArrowUpRight
              size={17}
              className="shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>

            <Link
            href="/search/ai"
            className="w-[70%] mx-auto group flex flex-1 items-center gap-3 rounded-2xl
            dark:bg-darkGray bg-white outline-2 outline-slate-200 dark:outline-gray-800
             border border-border/70 p-3
              text-left shadow-sm transition-all
               duration-200 hover:-translate-y-0.2 hover:opacity-80">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles size={21} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">
                Use AI-powered search
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                Describe your search naturally.
              </span>
            </span>
            <ArrowUpRight
              size={17}
              className="shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Filter toggle button */}
        <div
          onClick={() => (active.value = !active.value)}
          className="dark:bg-darkGray bg-white flex items-center justify-center  w-80  outline-2 outline-slate-200 dark:outline-gray-800 py-4 px-2 shadow-xs my-4 cursor-pointer rounded-2xl"
        >
          <span className="font-semibold text-gray-400 dark:text-gray-400 pl-2">
            Filter Listings
          </span>

          <ChevronDownCircle
            className={`w-6 h-6 text-gray-400 dark:text-gray-400 
              ml-auto ${active.value ? "rotate-180" : "rotate-0"} transition-all duration-250`}
          />
        </div>
      </div>

      {/* Filter dropdown */}
      <Filter
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
      <div className="subheading ml-3 p-1 w-full flex  gap-2 items-center">
        <MapPin className="text-goldPrimary w-6 h-6" />
        <div>
          Showing from {school.value ? "" : "all "}
          <span className="capitalize inline-flex items-center gap-1">
            {school.value || "schools"}
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
        }}
      />
    </main>
  )
}

export default HomePage
