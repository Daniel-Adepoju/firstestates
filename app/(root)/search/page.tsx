"use client"
import Searchbar from "@components/Searchbar"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import { DotsLoader } from "@utils/loaders"
import Card, { CardProps } from "@components/listing/Card"
import { useSearchListings } from "@lib/customApi"
import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Pagination from "@components/Pagination"
import { Search as SearchIcon } from "lucide-react"

const Search = () => {
  useSignals()
  const limit = useSignal(10)
  const params = useSearchParams()
  const router = useRouter()
  let page = params.get("page") || "1"
  const search = useSignal("")
  const debounced = useSignal("")
  const searchParams = new URLSearchParams(params.toString())

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchParams.set("page", "1")
      router.push(`?${searchParams.toString()}`)
      debounced.value = search.value
    }, 560)

    return () => clearTimeout(timeoutId)
  }, [search.value])

  const { data, isLoading, isError } = useSearchListings({
    limit: limit.value,
    page: page,
    location: debounced.value,
    status: "available", // only search available listings
    school: debounced.value,
    agentName: debounced.value,
    search: debounced.value,
    enabled: search.value.trim() !== "",
  })

  const mapCards = data?.posts?.map((item: CardProps["listing"]) => {
    return (
      <Card
        key={item._id}
        listing={item}
        edit={false}
      />
    )
  })

  if (isError) {
    return <div className="card">Failed</div>
  }
  return (
    <div className="mb-20 flex w-full flex-col items-center px-4 md:mb-6 md:px-6">
      <div className="mt-20 w-full max-w-4xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          <SearchIcon size={17} />
          Find your next home
        </div>
        <h1 className="font-list text-2xl font-semibold leading-tight text-foreground sm:text-6xl">
          Search for the home you want.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
       The keyword will search across locations, schools, and agents 
        </p>
      </div>
      <Searchbar
        placeholder={"Enter a keyword"}
        search={search.value}
        className="mt-8 gap-1 w-full flex flex-row justify-center items-center md:w-[60%]"
        setSearch={(e) => (search.value = e.target.value)}
      />
      {isLoading ? (
        <div className="my-20  mx-auto flex items-center gap-1">
          {/* <span className="text-gray-700 dark:text-gray-400">Searching</span> */}
          <DotsLoader className="bg-gray-700 dark:bg-gray-500" />
        </div>
      ) : (
        <>
          {debounced.value.trim() !== "" && (
            <div className="my-2 mx-auto text-sm font-bold text-goldPrimary">
              Showing Search Result For: {debounced.value}
            </div>
          )}

          <div className="card_list">{mapCards}</div>
        </>
      )}
      {data && !isLoading && (
        <Pagination
          currentPage={Number(data?.cursor)}
          totalPages={Number(data?.numOfPages)}
        />
      )}
    </div>
  )
}

export default Search
