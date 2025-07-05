"use client"
import Link from "next/link"
import {client} from '@lib/server/appwrite'
import { Models } from "appwrite"
import { useState, useEffect } from "react"
import { useUser } from "@utils/user"
import { CldImage } from "next-cloudinary"
import { useBackdrop } from "@lib/Backdrop"
import { useDarkMode } from "@lib/DarkModeProvider"
import { getUnreadChats } from "@lib/server/chats"
import {MessageSquare, Sun, Moon,LayoutDashboard, UserPlus2, UserPlus,LogIn} from "lucide-react"

const Nav = () => {
  const { session } = useUser()
  const [navbarFixed, setnavbarFixed] = useState<boolean>(false)
  const scrollThreshold = 500
  const backdrop = useBackdrop()
  const isActive = backdrop?.isActive ?? false
  const toggleNav = backdrop?.toggleNav
  const setIsActive = backdrop?.setIsActive ?? (() => {})
  const setToggleNav = backdrop?.setToggleNav ?? (() => {})
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [unreadMessages, setUnreadMessages] = useState<string>('0')

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

  useEffect(() => {
  const getUnread = async () => {
    if (!session?.user) return;
    const unread = await getUnreadChats(session?.user.id);
    setUnreadMessages(unread);
  };
  getUnread();
        const unsubscribe = client.subscribe(
              `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID}.documents`,
              (res) => {
                const newMsg = res.payload as Models.Document
                 if (newMsg?.userId === session?.user.id) return;
      
                     if (res.events.some((e) => e.includes('create'))) {
                 setUnreadMessages(prev => prev === '0' ? '1' : (parseInt(prev) + 1).toString())
            }
                 
                  if (res.events.some((e) => e.includes('update'))) {
                setUnreadMessages(unreadMessages)
              }
            
                  if (res.events.some((e) => e.includes('delete'))) {
                setUnreadMessages(prev => prev === '0' ? '0' : (parseInt(prev) - 1).toString())
              }
                
              })
    return () => unsubscribe()
  },[session?.user])

  const showNav = () => {
    setIsActive((prev) => !prev)
    setToggleNav((prev) => !prev)
  }

  const handleNavItemClick = () => {
  setIsActive(false);
  setToggleNav(false);
};
  return (
    <header
      id="nav"
      className={`nav ${navbarFixed && "fixedNav"} ${isActive && "fixedNav"} ${
        toggleNav && "activeNav"
      }`}
    >
      <Link href="/">
        <div className="logo">LOGO</div>
      </Link>
      {/* <div style={{ color: "black" }}>{session?.user.username}</div> */}
      <div
        onClick={showNav}
        className={`toggle_nav`}
      >
        <span className="toggle_items"></span>
        <span className="toggle_items"></span>
        <span className="toggle_items"></span>
      </div>
    <div className="nav_items" style={{ flexWrap: "wrap" }}>
  {session?.user && (
    <Link href="/client-settings" onClick={handleNavItemClick}>
      <CldImage
        width={35}
        height={35}
        alt="profile image"
        src={session?.user?.profilePic}
        crop={"fill"}
      />
    </Link>
  )}

  {/* Going To Dashboard */}
  {session?.user && session?.user.role !=='client' && (
    <div className="flex flex-row items-center gap-2 cursor-pointer">
   <div className="dark:bg-white bg-[#0874c7] p-2 rounded-full ">
      <LayoutDashboard size={20} color={darkMode ? '#f59e0b' : 'white'}/>
      </div>
      <Link href={session?.user.role ==='admin' ? '/admin' : '/agent'} 
      onClick={handleNavItemClick}>
        Dashboard
    </Link>
    </div>
  )}

  {/* Mode */}
  <div
    onClick={() => {
      toggleDarkMode();
      handleNavItemClick();
    }}
    className="flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-white bg-[#0874c7] p-2 rounded-full ">
      {darkMode ? (
        <Sun size={20} color="#f59e0b" />
      ) : (
        <Moon size={20} color="white" />
      )}
    </div>
    <span className="mode">{darkMode ? "Light Mode" : "Dark Mode"}</span>
  </div>


{/* chats */}
  {session?.user && (
      <div
    onClick={handleNavItemClick}
    className="relative flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-white bg-[#0874c7] p-2 rounded-full">
      <MessageSquare size={20} color={darkMode ? '#f59e0b' : 'white'}/>
      </div>
      <Link href="/inbox" onClick={handleNavItemClick}>Chats</Link>
      {unreadMessages && parseInt(unreadMessages) > 0 && (
        <div className="absolute w-6 h-6 top-[-16.5%] left-[0%] bg-red-800 text-white rounded-full px-2 py-1 text-xs font-bold">
          {unreadMessages}
        </div>
      )}
  </div>
  
  )}

{/* add roomie */}
  {session?.user && (
      <div
    onClick={handleNavItemClick}
    className="flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-white bg-[#0874c7] p-2 rounded-full">
      <UserPlus2 size={20} color={darkMode ? '#f59e0b' : 'white'}/>
      </div>
      <Link href="/listings" onClick={handleNavItemClick}>Request For Roomate</Link>
  </div>
  
  )}

  {!session?.user && (
    <>
       <div
    className="flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-white bg-[#0874c7] p-2 rounded-full">
      <LogIn size={20} color={darkMode ? '#f59e0b' : 'white'}/>
      </div>
     <Link href="/login" onClick={handleNavItemClick}>Login</Link>
  </div>

     <div
    className="flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-white bg-[#0874c7] p-2 rounded-full">
      <UserPlus size={20} color={darkMode ? '#f59e0b' : 'white'}/>
      </div>
  <Link href="/signup" onClick={handleNavItemClick}>Sign Up</Link>
  </div>
  
     
    </>
  )}
</div>

    </header>
  )
}

export default Nav
