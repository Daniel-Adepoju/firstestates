"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowRight, Bot, CheckCircle2, LoaderCircle, Search, Sparkles } from "lucide-react"
import { useAnimationIntersection } from "@lib/useIntersection"

interface SearchResult {
  _id: string
  location?: string
  school?: string
  listingType?: string
  price?: number
  mainImage?: string
}

export default function AISearchSection() {
  const sectionRef = useAnimationIntersection({ animation: "fade" })
  const [query, setQuery] = useState("Find an apartment near LASU under 1.5m")
  const [results, setResults] = useState<SearchResult[]>([])
  const [intent, setIntent] = useState<Record<string, unknown> | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [message, setMessage] = useState("")

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setMessage("")
    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, page: 1, limit: 3 }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Search failed")
      setResults(data.posts || [])
      setIntent(data.intent || null)
      if (!data.posts?.length) setMessage("No exact matches yet")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AI search is unavailable right now.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <section
      id="ai-search"
      className="flex w-full items-center bg-background px-4 py-20 sm:px-6 sm:py-24 lg:px-12"
    >
      <div
        ref={sectionRef}
        className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 text-center lg:flex-row lg:gap-16 lg:text-left"
      >
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center lg:items-start">
          <div className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            <Bot size={17} />
            Search with intention
          </div>
          <h2 className="font-head text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            Tell us what home means to you.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Our AI-powered search understands the way people actually talk. Mention a school, a
            neighbourhood, a budget, or the feeling you want, and it turns the thought into useful
            filters.
          </p>
          <div className="mt-8 flex w-full max-w-xl flex-col items-center gap-3 text-sm text-foreground lg:items-start">
            {[
              "Understands natural language, not just keywords",
              "Translates budgets like 500k and 1.5m",
              "Keeps school, location, and room details in context",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-greenPrimary"
                />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-2xl flex-1 rounded-[2rem] border border-border/70 bg-secondary/60 p-3 shadow-[0_18px_60px_rgba(3,38,121,0.1)] sm:p-6 dark:shadow-black/20">
          <div className="rounded-[1.5rem] bg-background p-5 sm:p-7">
            <div className="flex items-center gap-3 border-b border-border/60 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-semibold text-foreground">AI housing search</p>
                <p className="text-sm text-muted-foreground">Describe it in your own words</p>
              </div>
            </div>
            <form
              onSubmit={handleSearch}
              className="mt-6"
            >
              <label
                htmlFor="landing-ai-query"
                className="sr-only"
              >
                Describe the home you want
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-input bg-background px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                  <Search
                    size={18}
                    className="shrink-0 text-muted-foreground"
                  />
                  <input
                    id="landing-ai-query"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                >
                  {isSearching ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  Search
                </button>
              </div>
            </form>

            {intent && (
              <div className="mt-5 flex flex-wrap gap-2">
                {Object.entries(intent)
                  .filter(([, value]) => value !== null && value !== "")
                  .slice(0, 5)
                  .map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                    >
                      {key}: {String(value)}
                    </span>
                  ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-6 space-y-3">
                {results.map((result) => (
                  <Link
                    key={result._id}
                    href={`/listings/single_listing?id=${result._id}`}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/45 p-4 transition-colors hover:border-primary/40"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {result.listingType || "Available home"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {result.location || result.school || "Near campus"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {result.price ? `₦${result.price.toLocaleString()}` : "View"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            {message && <p className="mt-5 text-sm leading-6 text-muted-foreground">{message}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
