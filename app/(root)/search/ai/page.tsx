"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Bot, LoaderCircle, Sparkles } from "lucide-react"
import Card, { CardProps } from "@components/listing/Card"
import Pagination from "@components/Pagination"
import { useAISearchListing } from "@lib/customApi"
import Searchbar from "@components/Searchbar"

export default function AISearchPage() {
  const params = useSearchParams()
  const router = useRouter()
  const page = params.get("page") || "1"
  const [query, setQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState("")

  const { data, isLoading, isError } = useAISearchListing({
    query: submittedQuery,
    page,
    limit: 10,
    enabled: submittedQuery.trim() !== "",
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuery = query.trim()
    if (!nextQuery) return

    const searchParams = new URLSearchParams(params.toString())
    searchParams.set("page", "1")
    router.push(`?${searchParams.toString()}`)
    setSubmittedQuery(nextQuery)
  }

  const mapCards = data?.posts?.map((item: CardProps["listing"]) => (
    <Card
      key={item._id}
      listing={item}
      edit={false}
    />
  ))

  return (
    <main className="min-h-screen w-full bg-background px-4 pb-20 pt-20 sm:px-6 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        <div className="w-full max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            <Bot size={17} />
            AI-powered search
          </div>
          <h1 className="font-list text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            Describe the home you want.
          </h1>
          <div className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Mention a school, location, budget, or house details in your own words. We will turn it
            into a useful listing search.
          <div className="mt-2">
            E.g: a two-bedroom apartment near LASU under 1.5m
          </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex w-full max-w-3xl flex-col items-center gap-3 md:flex-row"
          >
            <Searchbar
              isAI={true}
              search={query}
              setSearch={(event) => setQuery(event.target.value)}
              placeholder="Write here..."
              // placeholderTextSize="placeholder:text-sm"
              className="flex w-full flex-1 flex-row justify-center items-center gap-2"
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="inline-flex  w-60 gloss
              min-h-14 items-center justify-center gap-2
               rounded-xl bg-goldPrimary px-6 text-sm
                font-semibold text-white 
                shadow-sm transition-transform 
                hover:shadow-md
                 focus-visible:outline-none
                  focus-visible:ring-2
                   focus-visible:ring-primary/40 
                   disabled:cursor-not-allowed 
                   disabled:opacity-50"
            >
              {isLoading ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Sparkles size={18} />
              )}
              Understand &amp; Search
            </button>
          </form>
        </div>

        {isError && (
          <div className="mt-12 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            AI search could not be completed. Please try again.
          </div>
        )}

        {isLoading && (
          <div className="mt-16 flex items-center gap-3 text-sm text-muted-foreground">
            <LoaderCircle
              size={20}
              className="animate-spin text-primary"
            />
            Understanding your search...
          </div>
        )}

        {!isLoading && submittedQuery && data?.posts?.length === 0 && (
          <div className="mt-16 max-w-md text-center text-sm leading-6 text-muted-foreground">
            No matching listings were found. Try a nearby location, a different school, or a wider
            budget.
          </div>
        )}

        {!isLoading && data?.posts?.length > 0 && <div className="card_list mt-12">{mapCards}</div>}

        {data && !isLoading && (
          <Pagination
            currentPage={Number(data.cursor)}
            totalPages={Number(data.numOfPages)}
          />
        )}
      </div>
    </main>
  )
}
