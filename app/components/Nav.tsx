"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useUser } from "@utils/user"
import { logOut } from "@lib/server/auth"
import { CldImage } from "next-cloudinary"
import { useBackdrop } from "@lib/Backdrop"
const Nav = () => {
  const { session } = useUser()
  const [navbarFixed, setnavbarFixed] = useState<boolean>(false)
  const scrollThreshold = 500
   const backdrop = useBackdrop()
   const isActive = backdrop?.isActive ?? false
   const toggleNav = backdrop?.toggleNav
   const setIsActive = backdrop?.setIsActive ?? (() => {})
   const setToggleNav = backdrop?.setToggleNav ?? (() => {})

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold && !isActive) {
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
      className={`nav ${navbarFixed && "fixedNav"} ${isActive && "fixedNav"} ${toggleNav && "activeNav"}`}
    >
      <Link href="/">
        <div className="logo">LOGO</div>
      </Link>
      <div style={{color:'black'}}>{session?.user.username}</div>
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
    
        
    {session?.user &&
    <>
    <Link href="/listings">Wishlist</Link>
    <Link onClick={async () => {await logOut()}}
        href="#"> Sign Out
        </Link>
        </>
        }
        {!session?.user && (
          <>
            <Link href="/signup">Sign Up</Link>
            <Link href="/login">Login</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Nav
