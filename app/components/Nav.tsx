"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useUser } from "@utils/user"
import { CldImage } from "next-cloudinary"
import { useBackdrop } from "@lib/Backdrop"
import { useDarkMode } from "@lib/DarkModeProvider"
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
  Users,
} from "lucide-react"
import { LogOutModal } from "./Modals"
import { useRouter, usePathname } from "next/navigation"
import NavToggleOptions from "@components/NavToggleOptions"
import Image from "next/image"
import { useGetUnreadCount } from "@lib/customApi"

const Nav = () => {
  const { session } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [navbarFixed, setnavbarFixed] = useState<boolean>(false)
  const scrollThreshold = 500
  const { backdrop, setBackdrop } = useBackdrop()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const logOutRef = useRef<any>(null)
  const { unreadCount } = useGetUnreadCount()

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

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [backdrop.isNavOpen])

  // check ably update to accurately push count

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
  }, [setBackdrop])

  const navItems = [
    // {
    //   condition: true,
    //   link: "/community",
    //   text: "Community",
    //   icon: <Users size={20} className="text-gray-700 dark:text-white" />,
    //   onClick: handleNavItemClick,
    //   className: "text-xs md:text-sm font-medium",
    // },
    // Non-client dashboard
    {
      condition: session?.user && session?.user?.role !== "client",
      link: session?.user?.role === "admin" ? "/admin" : "/agent",
      text: "Dashboard",
      icon: (
        <LayoutDashboard
          size={20}
          className="text-current"
        />
      ),
      onClick: handleNavItemClick,
      className:
        "text-xs md:text-sm font-medium md:darkblue-gradient md:dark:gold-gradient md:text-white md:px-4 md:py-2.5 md:rounded-xl md:hover-glass",
    },

    // School focus for clients
    {
      condition: session?.user?.role === "client" && session?.user?.school,
      link: session?.user?.school
        ? `/school-focus?school=${encodeURIComponent(session?.user?.school.toLowerCase())}`
        : "/",
      text: "School Focus",
      icon: <MapPinHouse size={20} className="text-current" />,
      onClick: handleNavItemClick,
      className:
        "text-xs md:text-sm font-medium md:darkblue-gradient md:dark:gold-gradient md:text-white md:px-4 md:py-2.5 md:rounded-xl md:hover-glass",
    },

    // Chats
    {
      condition: session?.user,
      link: "/inbox",
      text: "Chats",
      icon: (
        <MessageSquare
          size={20}
          className="text-current"
        />
      ),
      // badge: unreadCount,
      onClick: handleNavItemClick,
      className: "text-xs md:text-sm font-medium",
    },

    // Wishlist
    {
      condition: session?.user,
      link: "/listings/wishlists",
      text: "Wishlist",
      icon: (
        <Heart
          size={20}
          className="text-current"
        />
      ),
      onClick: handleNavItemClick,
      className: "text-xs md:text-sm font-medium",
    },

    // Login (only signed out)
    {
      condition: !session?.user,
      link: "/login",
      text: "Login",
      icon: (
        <LogIn
          size={20}
          className="text-current"
        />
      ),
      onClick: handleNavItemClick,
      className:
        "text-xs md:text-sm font-medium md:darkblue-gradient md:dark:gold-gradient md:text-white md:px-4 md:py-2.5 md:rounded-xl md-gloss",
    },

    // Sign Up (only signed out)
    {
      condition: !session?.user,
      link: "/signup",
      text: "Sign Up",
      icon: (
        <UserPlus
          size={20}
          className="text-current"
        />
      ),
      onClick: handleNavItemClick,
      className:
        "text-xs md:text-sm font-medium md:border-2 md:border-darkblue md:dark:border-goldPrimary md:text-darkblue md:dark:text-white md:px-4 md:py-2 md:rounded-xl md-gloss",
    },
  ].filter((item) => item.condition)

  if (pathname.includes("/chat") || pathname.includes("/inbox")) {
    return null
  }

  // A listing has its own action/navigation needs and renders SingleListingNav
  // with the listing context. Do not render the generic site nav on that route.
  if (pathname.includes("/listings/single_listing")) {
    return null
  }

  return (
    <header
      id="nav"
      className={`nav relative ${navbarFixed && "fixedNav"} ${backdrop.isNavOpen && "activeNav"}`}
    >
      <Link
        href="/"
        onClick={handleNavItemClick}
        className="flex items-center"
      >
        {/* <div className="logo">LOGO</div> */}
        <Image
          src="/logo/logoWithoutText.png"
          alt="logo"
          width={1000}
          height={1000}
          className="w-[50px] h-auto"
        />
        <div className="flex items-center w-[100px] h-[16px] overflow-hidden -ml-[16px] rounded-xl">
          <>
            <Image
              src="/logo/wordmark.png"
              alt="wordmark"
              width={1000}
              height={500}
              className="w-full h-full object-cover contrast-more saturate-200 dark:hidden"
            />

            <Image
              src="/logo/wordmarkDark.png"
              alt="wordmark"
              width={1000}
              height={500}
              className="hidden w-full h-full object-cover contrast-more saturate-200 dark:block"
            />
          </>
        </div>
      </Link>

      {/* test */}

      {/*  */}

      <div className="flex gap-3 items-center">
        {/* profile pic */}
        {session?.user && (
          <Link
            href="/client-settings"
            onClick={handleNavItemClick}
            aria-label="Profile settings"
            className="flex items-center justify-center rounded-full p-0.5 hover:ring-2 hover:ring-darkblue dark:hover:ring-goldPrimary transition-all"
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
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center justify-center w-10 h-10 rounded-full darkblue-gradient dark:gold-gradient hover-glass hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {darkMode ? (
            <Sun size={20} className="text-white" />
          ) : (
            <Moon size={20} className="text-white" />
          )}
        </button>

        {/*nav items  */}
        <div className={`nav_items relative md:pr-3 md:pt-1`}>
          {backdrop.isNavOpen && (
            <NavToggleOptions
              toggleFunc={showNav}
              logOutRef={logOutRef}
            />
          )}

          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map((item, index) => {
              const isActive =
                pathname === item.link.split("?")[0] ||
                pathname.startsWith(`${item.link.split("?")[0]}/`)

              return (
                <Link
                  key={index}
                  href={item.link}
                  onClick={item.onClick}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    relative
                    inline-flex flex-col md:flex-row
                    items-center justify-center
                    gap-1 md:gap-2
                    px-2.5 md:px-3.5
                    py-2
                    rounded-xl
                    cursor-pointer
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-darkblue/10 text-darkblue dark:bg-goldPrimary/15 dark:text-goldPrimary"
                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                    }
                    ${item.className || ""}
                  `}
                >
                  {/* icon */}
                  <span className="flex items-center justify-center shrink-0">
                    {item.icon}
                  </span>

                  {/* text */}
                  <span className="link_line whitespace-nowrap">
                    {item.text}
                  </span>

                  {/* Optional unread badge */}
                  {item.text === "Chats" && unreadCount && parseInt(unreadCount) > 0 ? (
                    <span
                      aria-label={`${unreadCount} unread messages`}
                      className="absolute w-2 h-2 top-1 right-1 darkblue-gradient dark:gold-gradient rounded-full ring-2 ring-white dark:ring-gray-900"
                    >
                      {/* {unreadCount} */}
                    </span>
                  ) : (
                    ""
                  )}
                </Link>
              )
            })}

            {/* more */}
            {/* toggle more btn */}
            <button
              type="button"
              onClick={showNav}
              aria-label={backdrop.isNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={Boolean(backdrop.isNavOpen)}
              className="toggle_nav inline-flex flex-col items-center justify-center gap-[4px] w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <span
                className={`toggle_items bg-gray-700 dark:bg-white transition-all ${
                  backdrop.isNavOpen
                    ? "translate-y-[6px] rotate-45"
                    : ""
                }`}
              />
              <span
                className={`toggle_items bg-gray-700 dark:bg-white transition-all ${
                  backdrop.isNavOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`toggle_items bg-gray-700 dark:bg-white transition-all ${
                  backdrop.isNavOpen
                    ? "-translate-y-[6px] -rotate-45"
                    : ""
                }`}
              />
            </button>
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