"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useUser } from "@utils/user"
import { signOut } from "@auth"
import { useBackdrop } from "@lib/Backdrop"
const AgentDashboardNav = () => {
  const { session } = useUser()
  const [navbarFixed, setnavbarFixed] = useState(false)
  const [toggleNav, setToggleNav] = useState(false)
  const scrollThreshold = 150
   const {setIsActive} = useBackdrop()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setnavbarFixed(true)
      } else {
        setnavbarFixed(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  })

  const showNav = () => {
    setIsActive(prev => !prev)
    setToggleNav(prev => !prev)
  }
  return (
    <header
      id="nav"
      className={`agentNav nav ${navbarFixed && "fixedNav"} ${toggleNav && "activeNav"}`}
    >
    
      <div
        onClick={showNav}
        className={`toggle_nav`}
      >
        <span className="toggle_items"></span>
        <span className="toggle_items"></span>
        <span className="toggle_items"></span>
      </div>
      <div
        className="nav_items">
        {session?.user && (
            <>
        <Link href="/listings">Add Listing</Link>
        <Link href="#"> Sign Out</Link> 
        </>
    )}
        </div>
        {/* <Link href='#'>
      <div className="logo">LOGO</div>
      </Link>   */}
    </header>
  )
}

export default AgentDashboardNav
