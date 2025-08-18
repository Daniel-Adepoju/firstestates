'use client'

import { useState ,useEffect} from "react"
import Image from "next/image"
import Link from "next/link"

import { ReactNode } from "react"
import { ChevronUpCircle } from "lucide-react"

const Main =  ({children}: { children: ReactNode }) => {
 const [goUpVisible,setgoUpVisible] = useState(false)
const scrollThreshold = 1200

   useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setgoUpVisible(true)
      } else {
        setgoUpVisible(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  })
  return (
    <main className="main">
    {children}
      {goUpVisible && (
             <Link
               className="goUp"
               href="#nav"
             >
               <div className="clickable">
              <ChevronUpCircle size={40} color="white"/>
               </div>
             </Link>
           )}
    </main>
     
  )
}

export default Main
