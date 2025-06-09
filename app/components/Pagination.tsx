'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

const Pagination = ({ currentPage, totalPages}:PaginationProps) => {
  const router = useRouter()
  const params = useSearchParams()

  const navigateToPage = (page: number) => {
    const searchParams = new URLSearchParams(params.toString())
    searchParams.set('page', page.toString())
    router.push(`?${searchParams.toString()}`)
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
    <div className="pagination flex justify-between items-center p-4 px-8 bg-white shadow-md rounded-xl w-sm lg:w-lg mx-auto
   
    ">
      <button
        onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
        className="dark:text-coffee text-[rgb(8,116,199)] font-semibold disabled:opacity-30"
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <div className="flex gap-4">
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => navigateToPage(num)}
            className={`px-3 py-1 rounded-md shadow-sm ${
              num === currentPage
                ? 'dark:bg-coffee bg-[rgb(8,116,199)] text-white'
                : 'dark:text-white text-[rgb(8,116,199)]'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigateToPage(Math.min(totalPages, currentPage + 1))}
        className="dark:text-coffee text-[rgb(8,116,199)] font-semibold disabled:opacity-30"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
