"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useUser } from "@utils/user"
import { signOut } from "@auth"
import { CldImage } from "next-cloudinary"
import { useBackdrop } from "@lib/Backdrop"
const Nav = () => {
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
      className={`nav ${navbarFixed && "fixedNav"} ${toggleNav && "activeNav"}`}
    >
      <Link href="/">
        <div className="logo">LOGO</div>
      </Link>
      <div
        onClick={showNav}
        className={`toggle_nav`}
      >
        <span className="toggle_items"></span>
        <span className="toggle_items"></span>
        <span className="toggle_items"></span>
      </div>
      <div
        className="nav_items"
        style={{ flexWrap: "wrap" }}
      >
        {session?.user && (
          <CldImage
            width={35}
            height={35}
            alt="profile image"
            src={session?.user?.profilePic}
            crop={"fill"}
          />
        )}
        <Link href="/listings">Browse Listings</Link>
        {!session?.user && (
          <>
            <Link href="/signup">Sign Up</Link>
            <Link href="/login">Login</Link>
          </>
        )}
        {session?.user && <Link href="#"> Sign Out</Link>}
      </div>
    </header>
  )
}

export default Nav
