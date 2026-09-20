"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  hashParams?: string
}

const Pagination = ({ currentPage, totalPages, hashParams }: PaginationProps) => {
  const router = useRouter()
  const params = useSearchParams()

  const navigateToPage = (page: number) => {
    const searchParams = new URLSearchParams(params.toString())
    searchParams.set("page", page.toString())
    router.push(`?${searchParams.toString()}${hashParams ? hashParams : ""}`)
  }

  const getPageNumbers = () => {
    const pages = []
    const start = Math.max(currentPage - 1, 1)
    const end = Math.min(start + 2, totalPages)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div
      className="pagination mx-auto mb-4 flex w-[min(94%,34rem)] items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/80 px-3 py-3 shadow-lg backdrop-blur-sm sm:px-5"
    >
      <button
        onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
        aria-label="Go to previous page"
        title="Previous page"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-secondary/60 text-foreground transition-all hover:-translate-x-0.5 hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-x-0"
        disabled={currentPage === 1}
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <div className="flex min-w-0 items-center justify-center gap-2 sm:gap-3">
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => navigateToPage(num)}
            aria-label={`Go to page ${num}`}
            aria-current={num === currentPage ? "page" : undefined}
            className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              num === currentPage
                ? "gold-gradient scale-105 text-white shadow-md shadow-[#f29829]/25 ring-2 ring-[#f7b657]/30"
                : "border border-border/70 bg-secondary/60 text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigateToPage(Math.min(totalPages, currentPage + 1))}
        aria-label="Go to next page"
        title="Next page"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-secondary/60 text-foreground transition-all hover:translate-x-0.5 hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-x-0"
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </div>
  )
}

export default Pagination
