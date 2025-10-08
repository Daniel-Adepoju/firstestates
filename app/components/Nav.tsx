"use client"
import Link from "next/link"
import { client } from "@lib/server/appwrite"
import { Models } from "appwrite"
import { useState, useEffect } from "react"
import { useUser } from "@utils/user"
import { CldImage } from "next-cloudinary"
import { useBackdrop } from "@lib/Backdrop"
import { useDarkMode } from "@lib/DarkModeProvider"
import { getUnreadChats } from "@lib/server/chats"
import {
  Heart,
  MessageSquare,
  Sun,
  Moon,
  LayoutDashboard,
  UserPlus2,
  UserPlus,
  LogIn,
  Focus,
  MapPinHouse,
  Settings,
  User,
  Headphones,
  Headset,
} from "lucide-react"
import { HouseSearchIcon } from "./custom-ui/Icons"
import { useRouter } from "next/navigation"
import CardOptions from "./CardOptions"
const Nav = () => {
  const { session } = useUser()
  const router = useRouter()
  const [navbarFixed, setnavbarFixed] = useState<boolean>(false)
  const scrollThreshold = 500
  const {backdrop,setBackdrop} = useBackdrop()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [unreadMessages, setUnreadMessages] = useState<string>("0")

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold && !backdrop.isNavOpen) {
        setnavbarFixed(true)
      } else {
        setnavbarFixed(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  })

  useEffect(() => {
    const getUnread = async () => {
      if (!session?.user) return
      const unread = await getUnreadChats(session?.user.id)
      setUnreadMessages(unread)
    }
    getUnread()
    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID}.documents`,
      (res) => {
        const newMsg = res.payload as Models.Document
        if (newMsg?.userId === session?.user.id) return

        if (res.events.some((e) => e.includes("create"))) {
          setUnreadMessages((prev) => (prev === "0" ? "1" : (parseInt(prev) + 1).toString()))
        }

        if (res.events.some((e) => e.includes("update"))) {
          setUnreadMessages(unreadMessages)
        }

        if (res.events.some((e) => e.includes("delete"))) {
          setUnreadMessages((prev) => (prev === "0" ? "0" : (parseInt(prev) - 1).toString()))
        }
      }
    )
    return () => unsubscribe()
  }, [session?.user])

  const showNav = () => {
  setBackdrop({isNavOpen: !backdrop.isNavOpen})
  }
  const handleNavItemClick = () => {
    setBackdrop({isNavOpen: false})
  }

  return (
    <header
      id="nav"
      className={`nav ${navbarFixed && "fixedNav"} ${backdrop.isNavOpen && "activeNav"}`}
    >
      <Link href="/">
        <div className="logo">LOGO</div>
      </Link>

      {/* test */}

      {/*  */}

      <div className="flex gap-4 items-center">
        {/* profile pic */}
        {session?.user && (
          <Link
            href="/client-settings"
            onClick={handleNavItemClick}
            className="pt-1"
          >
            <CldImage
              width={35}
              height={35}
              alt="profile image"
              src={session?.user?.profilePic}
              crop={"fill"}
              className="profilePic"
            />
          </Link>
        )}
        {/* mode btn */}
        <div
          onClick={() => {
            toggleDarkMode()
          }}
          className="flex flex-row items-center gap-2  pt-1 cursor-pointer"
        >
          <div className="dark:bg-coffee bg-darkblue p-2 rounded-full ">
            {darkMode ? (
              <Sun
                size={20}
                color="white"
              />
            ) : (
              <Moon
                size={20}
                color="white"
              />
            )}
          </div>
        </div>

        {/*nav items  */}
        <div className={`nav_items md:pr-3 md:pt-1`}>
          {/* Unique To Non-CLient Accounts */}
          {/* Going To Dashboard */}
          {session?.user && session?.user.role !== "client" && (
            <Link
              href={session?.user.role === "admin" ? "/admin" : "/agent"}
              onClick={handleNavItemClick}
              className="flex flex-col md:flex-row items-center gap-0 md:gap-2 cursor-pointer"
            >
              <div className="dark:bg-coffee bg-darkblue p-2 rounded-full ">
                <LayoutDashboard
                  size={20}
                  color={"white"}
                />
              </div>
              <div className="link_line md:w-full md:text-white md:bg-darkblue md:dark:bg-coffee md:px-4 md:py-2 rounded-md hover:opacity-95 transition">
                Dashboard
              </div>
            </Link>
          )}

          {/* Unique To Client Account */}

          {session?.user && session?.user.role === "client" && (
            <>
              {/* add roomie */}
              {/* <div
    onClick={handleNavItemClick}
    className="flex flex-col md:flex-row items-center gap-0 md:gap-2 cursor-pointer"
  >
    <div className="dark:bg-coffee bg-darkblue p-2 rounded-full">
      <UserPlus2 size={20} color={'white'}/>
      </div>
      <Link href="/listings" onClick={handleNavItemClick}>Roomate Match</Link>
  </div> */}

              {/* school focus */}
              {session?.user.school && (
                <Link
                  href={session?.user.role === "admin" ? "/admin" : "/agent"}
                  onClick={handleNavItemClick}
                  className="flex flex-col md:flex-row items-center gap-2 cursor-pointer"
                >
                  <div className="dark:bg-coffee bg-darkblue p-2 rounded-full ">
                    <MapPinHouse className="w-5 h-5 text-white" />
                  </div>
                  <div className="link_line md:w-full md:text-white md:bg-darkblue md:dark:bg-coffee md:px-4 md:py-2 rounded-md hover:opacity-95 transition">
                    School Focus
                  </div>
                </Link>
              )}
            </>
          )}

          {/* Other Features */}

          {/* chats */}
          {session?.user && (
            <Link
              href="/inbox"
              onClick={handleNavItemClick}
              className="relative flex flex-col md:flex-row items-center gap-0 md:gap-2 cursor-pointer"
            >
              <div className=" dark:bg-coffee bg-darkblue p-2 rounded-full">
                <MessageSquare
                  size={20}
                  color={"white"}
                />
              </div>
              <div className="link_line">Chats</div>
              {unreadMessages && parseInt(unreadMessages) > 0 && (
                <div className="flex items-center justify-center absolute w-6 h-6 top-[-16.5%] left-[0%] bg-red-800 text-white rounded-full px-2 py-1 text-xs font-bold">
                  {unreadMessages}
                </div>
              )}
            </Link>
          )}

          {/* wishlists */}
          {session?.user && (
            <Link
              href="/listings/wishlists"
              onClick={handleNavItemClick}
              className="flex flex-col md:flex-row items-center gap-0 md:gap-2 cursor-pointer"
            >
              <div className="dark:bg-coffee bg-darkblue p-2 rounded-full">
                <Heart
                  size={20}
                  color={"white"}
                />
              </div>
              <div
                className="link_line"
                onClick={handleNavItemClick}
              >
                Wishlist
              </div>
            </Link>
          )}

          {/* Unique to signed Out */}
          {!session?.user && (
            <>
              {/* login */}
              <Link
                href="/login"
                onClick={handleNavItemClick}
                className="flex flex-col md:flex-row items-center gap-0 md:gap-2 cursor-pointer"
              >
                <div className="dark:bg-coffee bg-darkblue p-2 rounded-full">
                  <LogIn
                    size={20}
                    color={"white"}
                  />
                </div>
                <div className="link_line md:w-full md:text-white md:bg-darkblue md:dark:bg-coffee md:px-4 md:py-2 rounded-md hover:opacity-95 transition">
                  Login
                </div>
              </Link>

              {/* signup */}
              <Link
                href="/signup"
                onClick={handleNavItemClick}
                className="flex flex-col md:flex-row items-center gap-0 md:gap-2 cursor-pointer"
              >
                <div className="dark:bg-coffee bg-darkblue p-2 rounded-full">
                  <UserPlus
                    size={20}
                    color={"white"}
                  />
                </div>
                <div className="link_line md:w-full md:text-darkblue md:dark:text-coffee md:border-2 md:border-darkblue md:dark:border-coffee md:px-4 md:py-2 md:rounded-md hover:opacity-90 transition">
                  Sign Up
                </div>
              </Link>
            </>
          )}

          {/* more */}
          {/* more btn */}
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 cursor-pointer">
            <div
              onClick={showNav}
              className={`toggle_nav`}
            >
              <div className="toggle_items"></div>
              <div className="toggle_items"></div>
              <div className="toggle_items"></div>
            </div>
          </div>

          {/* more content */}

          {/* display options */}
          <CardOptions />
        </div>
      </div>
    </header>
  )
}

export default Nav
