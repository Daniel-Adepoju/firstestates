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
  const [toggleNav, setToggleNav] = useState<boolean>(false)
  const scrollThreshold = 400
   const backdrop = useBackdrop()

  //  console.log(opp)
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
    backdrop?.setIsActive(prev => !prev)
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
        <Link href="/listings">Browse Listings</Link>
        {!session?.user && (
          <>
            <Link href="/signup">Sign Up</Link>
            <Link href="/login">Login</Link>
          </>
        )}
    {session?.user && <Link onClick={async () => {
           await logOut()
          }}
        href="#"> Sign Out
        </Link>}
      </div>
    </header>
  )
}

export default Nav
