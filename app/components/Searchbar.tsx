"use client"
import { Search } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"

interface SearchProps {
  search?: string
  placeholder?: string
  goToSearch?: () => void
  setSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const Searchbar = ({ search, placeholder, goToSearch, setSearch, className }: SearchProps) => {
  return (
    <div
      className={
        className ||
        "mt-[80px] gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]"
      }
    >
      <div className="dark:bg-darkGray bg-white border-2 border-gray-200 dark:border-gray-500 rounded-sm p-1">
        <Search
          size={32}
          className="text-goldPrimary"
        />
      </div>
      <input
        className="w-[80%] dark:bg-darkGray
     py-3 pr-2 pl-4
  outline-1 outline-gray-400 dark:outline-gray-400
  focus:outline-2
    rounded-sm
     dark:caret-white caret-blue-300 transition-outline duration-200 ease-in-out"
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
