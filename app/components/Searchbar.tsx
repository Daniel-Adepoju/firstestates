"use client"
import { Search, Sparkles } from "lucide-react"

interface SearchProps {
  search?: string
  placeholder?: string
  goToSearch?: () => void
  setSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  isAI?: boolean
  placeholderTextSize?: string
}

const Searchbar = ({
  search,
  placeholder,
  goToSearch,
  setSearch,
  className,
  isAI = false,
  placeholderTextSize = "",
}: SearchProps) => {
  return (
    <div
      className={
        className ||
        "mt-[80px] min-w-0 gap-1 w-full flex flex-row justify-center items-center md:justify-end md:w-[60%]"
      }
    >
      <div className="shrink-0 dark:bg-darkGray bg-white outline-2 outline-slate-200 dark:outline-gray-800 rounded-md p-2 flex items-center gap-2">
        {isAI ? (
          <Sparkles
            size={32}
            className="text-goldPrimary"
          />
        ) : (
          <Search
            size={32}
            className="text-goldPrimary"
          />
        )}
      </div>
      <input
        className={`min-w-0 flex-1 bg-white dark:bg-darkGray
     py-3.5 pr-2 pl-4
  outline-2 outline-slate-200 dark:outline-gray-800
  focus:outline-3 focus:scale-99
     font-medium text-gray-700 dark:text-gray-200 
     placeholder-gray-400 dark:placeholder-gray-400 ${placeholderTextSize}
    rounded-md
     dark:caret-white caret-blue-300 transition-outline duration-200 ease-in-out`}
        type="text"
        onClick={goToSearch && goToSearch}
        onChange={setSearch}
        value={search}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Searchbar
