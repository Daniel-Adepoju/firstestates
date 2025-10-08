'use client'
import { Search } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"

interface SearchProps {
    search?: string
    placeholder?: string
    goToSearch?: () => void
    setSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?:string
}

const Searchbar = ({search,placeholder,goToSearch,setSearch,className}:SearchProps) => {
  
  return (
  <div className={className || "mt-[80px] gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]"}>
   <div className="dark:bg-white bg-gray-600/20 rounded-sm p-1">
    <Search size={32} className="dark:text-[#A88F6E]  text-[#0874c7]"/>
   </div>
    <input className="dark:bg-gray-600
     py-2.5 pr-2 pl-4 border-gray-400 w-[80%] border-1
    rounded-sm dark:caret-white caret-blue-300 transition-all duration-300 ease-in focus:border-blue-100" type="text"
    onClick={goToSearch && goToSearch}
    onChange={setSearch}
    value={search}
    placeholder={placeholder}
    />
  </div>
  )
}

export default Searchbar