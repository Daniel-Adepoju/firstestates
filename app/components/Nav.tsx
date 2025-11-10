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
import { useRouter, usePathname } from "next/navigation"

const Nav = () => {
  const { session } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [navbarFixed, setnavbarFixed] = useState<boolean>(false)
  const scrollThreshold = 500
  const { backdrop, setBackdrop } = useBackdrop()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [unreadMessages, setUnreadMessages] = useState<string>("0")

  const handleNavItemClick = () => {
    setBackdrop({ isNavOpen: false })
  }

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
    setBackdrop({ isNavOpen: !backdrop.isNavOpen })
  }
  const navItems = [
    // Non-client dashboard
    {
      condition: session?.user && session.user.role !== "client",
      link: session?.user?.role === "admin" ? "/admin" : "/agent",
      text: "Dashboard",
      icon: (
        <LayoutDashboard
          size={20}
          className="text-gray-700 dark:text-white"
        />
      ),
      onClick: handleNavItemClick,
      className:
        "md:bg-darkblue  md:dark:bg-goldPrimary  md:text-white md:px-4 md:py-2 md:rounded-md hover-glassd",
    },

    // School focus for clients
    {
      condition: session?.user?.role === "client" && session?.user?.school,
      link: session?.user?.school
        ? `/school-focus?school=${encodeURIComponent(session?.user?.school.toLowerCase())}`
        : "/",
      text: "School Focus",
      icon: (
        <MapPinHouse
          className="w-5 h-5 text-gray-700 dark:text-white"
        />
      ),
      onClick: handleNavItemClick,
      className:
        "md:bg-darkblue md:dark:bg-goldPrimary  md:text-white md:px-4 md:py-2 md:rounded-md md:hover-glass",
    },

    // Chats
    {
      condition: session?.user,
      link: "/inbox",
      text: "Chats",
      icon: (
        <MessageSquare
          size={20}
          className="text-gray-700 dark:text-white"
        />
      ),
      badge: unreadMessages,
      onClick: handleNavItemClick,
      className: "relative",
    },

    // Wishlist
    {
      condition: session?.user,
      link: "/listings/wishlists",
      text: "Wishlist",
      icon: (
        <Heart
          size={20}
          className="text-gray-700 dark:text-white"
        />
      ),
      onClick: handleNavItemClick,
    },

    // Login (only signed out)
    {
      condition: !session?.user,
      link: "/login",
      text: "Login",
      icon: (
        <LogIn
          size={20}
          className="text-gray-700 dark:text-white"
        />
      ),
      onClick: handleNavItemClick,
      className:
        "md:bg-darkblue  md:dark:bg-goldPrimary  md:text-white md:px-4 md:py-2 md:rounded-md md:hover-glass",
    },

    // Sign Up (only signed out)
    {
      condition: !session?.user,
      link: "/signup",
      text: "Sign Up",
      icon: (
        <UserPlus
          size={20}
          className="text-gray-700 dark:text-white"
        />
      ),
      onClick: handleNavItemClick,
      className:
        "md:border-2 md:border-darkblue md:dark:border-goldPrimary md:text-darkblue md:dark:text-coffee md:px-4 md:py-2 md:rounded-md md:hover-glass",
    },
  ].filter((item) => item.condition)

  if (pathname.includes("/chat")) return null

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
          <div className="bg-darkblue dark:bg-goldPrimary p-2 rounded-full hover-glass">
            {darkMode ? (
              <Sun
                size={20}
                className="text-white"
              />
            ) : (
              <Moon
                size={20}
                className="text-white"
              />
            )}
          </div>
        </div>

        {/*nav items  */}
        <div className={`nav_items md:pr-3 md:pt-1`}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              onClick={item.onClick}
              className={`relative flex flex-col md:flex-row items-center gap-0 md:gap-2 cursor-pointer`}
            >
              {/* icon */}
              <div className="p-2 rounded-full">{item.icon}</div>
              {/* text */}
              <div className={` link_line ${item.className || ""}`}>{item.text}</div>
              {/* Optional unread badge */}
              {item.text === "Chats" && unreadMessages && parseInt(unreadMessages) > 0 && (
                <div className="flex items-center justify-center absolute w-6 h-6 top-[-16.5%] left-[0%] bg-darkblue  dark:bg-goldPrimary text-white rounded-full px-2 py-1 text-xs font-bold">
                  {unreadMessages}
                </div>
              )}
            </Link>
          ))}

          {/* more */}
          {/* more btn */}
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 cursor-pointer">
            <div
              onClick={showNav}
              className={`toggle_nav`}
            >
              <div className="toggle_items bg-gray-700 dark:bg-white"></div>
              <div className="toggle_items bg-gray-700 dark:bg-white"></div>
              <div className="toggle_items bg-gray-700 dark:bg-white"></div>
            </div>
          </div>

          {/* more content */}

          {/* display options */}
        </div>
      </div>
    </header>
  )
}

export default Nav
