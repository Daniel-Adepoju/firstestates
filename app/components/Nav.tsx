"use client"
import Link from "next/link"
import { client } from "@lib/server/appwrite"
import { Models } from "appwrite"
import { useState, useEffect, useRef } from "react"
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
import { LogOutModal } from "./Modals"
import { useRouter, usePathname } from "next/navigation"
import NavToggleOptions from "@components/NavToggleOptions"
import Image from "next/image"

const Nav = () => {
  const { session } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [navbarFixed, setnavbarFixed] = useState<boolean>(false)
  const scrollThreshold = 500
  const { backdrop, setBackdrop } = useBackdrop()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [unreadMessages, setUnreadMessages] = useState<string>("0")
  const logOutRef = useRef<any>(null)

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
        if (newMsg?.senderId === session?.user.id) return

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
  // falsify showNav on window size change 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setBackdrop({ isNavOpen: false })
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  

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
        "text-xs md:text-sm font-medium md:darkblue-gradient md:dark:gold-gradient  md:text-white md:px-4 md:py-2 md:rounded-md md:hover-glass",
    },

    // School focus for clients
    {
      condition: session?.user?.role === "client" && session?.user?.school,
      link: session?.user?.school
        ? `/school-focus?school=${encodeURIComponent(session?.user?.school.toLowerCase())}`
        : "/",
      text: "School Focus",
      icon: <MapPinHouse className="w-5 h-5 text-gray-700 dark:text-white" />,
      onClick: handleNavItemClick,
      className:
        "text-xs md:text-sm font-medium md:darkblue-gradient md:dark:gold-gradient  md:text-white md:px-4 md:py-2 md:rounded-md md:hover-glass",
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
      className: "relative text-xs md:text-sm font-medium",
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
      className: "text-xs md:text-sm font-medium"
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
        " text-xs md:text-sm font-medium md:darkblue-gradient  md:dark:gold-gradient  md:text-white md:px-4 md:py-2 md:rounded-md md-gloss",
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
        "text-xs md:text-sm font-medium md:border-2 md:border-darkblue md:dark:border-goldPrimary md:text-darkblue md:dark:text-white md:px-4 md:py-2 md:rounded-md md-gloss",
    },
  ].filter((item) => item.condition)

  if (pathname.includes("/chat") || pathname.includes("/inbox")) {
    return null
  }

  return (
    <header
      id="nav"
      className={`nav relative ${navbarFixed && "fixedNav"} ${backdrop.isNavOpen && "activeNav"}`}
    >
      <Link 
      href="/"
      className='flex items-center'
      >
        {/* <div className="logo">LOGO</div> */}
        <Image
          src="/logo/logoWithoutText.png"
          alt="logo"
          width={1000}
          height={1000}
          className='w-[50px] h-auto'
        />
<div className="flex items-center w-[100px] h-[16px] overflow-hidden -ml-[14px]  rounded-xl">
  <Image
    src={darkMode ? '/logo/wordmarkDark.png' : '/logo/wordmark.png'}
    alt="wordmark"
    width={1000}
    height={500}
    className="w-full h-full object-cover contrast-more saturate-200"
  />

</div>
    
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
          <div className="darkblue-gradient dark:gold-gradient p-2 rounded-full hover-glass">
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
        <div className={`nav_items relative  md:pr-3 md:pt-1`}>
          {backdrop.isNavOpen && <NavToggleOptions toggleFunc={showNav} logOutRef={logOutRef} />}
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
                <div className="flex items-center justify-center absolute w-6 h-6 top-[-16.5%] left-[0%] darkblue-gradient  dark:gold-gradient text-white rounded-full px-2 py-1 text-xs font-bold">
                  {unreadMessages}
                </div>
              )}
            </Link>
          ))}

          {/* more */}
          {/* toggle more btn */}
          <div className="relative flex flex-col md:flex-row items-center gap-1 md:gap-2 cursor-pointer">
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

      {/* modals and miscellaneous */}
      <LogOutModal ref={logOutRef} />
    </header>
  )
}

export default Nav
