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
import {Heart,MessageSquare, Sun, Moon,LayoutDashboard, UserPlus2, UserPlus,LogIn, Focus, MapPinHouse, } from "lucide-react"
import { HouseSearchIcon } from "./custom-ui/Icons"
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

{/* test */}
  <div
    onClick={() => {
      toggleDarkMode();
      handleNavItemClick();
    }}
    className="flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-coffee bg-darkblue p-2 rounded-full ">
      {darkMode ? (
        <Sun size={20} color="white" />
      ) : (
        <Moon size={20} color="white" />
      )}
    </div>
    <span className="mode">{darkMode ? "Light Mode" : "Dark Mode"}</span>
  </div>
{/*  */}
  
     <div className="flex gap-4 items-center">
     {/* profile pic */}
      {session?.user && (
    <Link href="/client-settings" onClick={handleNavItemClick}>
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
  {/* hamburger menu */}
      <div
        onClick={showNav}
        className={`toggle_nav`}
      >
        <span className="toggle_items"></span>
        <span className="toggle_items"></span>
        <span className="toggle_items"></span>
      </div>
    <div className={`nav_items md:pr-3 ${isActive && 'p-3 md:p-0'}`}>
 

{/* Unique To Non-CLient Accounts */}
  {/* Going To Dashboard */}
  {session?.user && session?.user.role !=='client' && (
    <div className="flex flex-row items-center gap-2 cursor-pointer">
   <div className="dark:bg-coffee bg-darkblue p-2 rounded-full ">
      <LayoutDashboard size={20} color={'white'}/>
      </div>
      <Link 
      href={session?.user.role ==='admin' ? '/admin' : '/agent'} 
      onClick={handleNavItemClick}
      className="w-50 md:w-full text-white bg-darkblue dark:bg-coffee px-4 py-2 rounded-md hover:opacity-95 transition"
      >
        Dashboard
    </Link>
    </div>
  )}



{/* Unique To Client Account */}

  {session?.user &&  session?.user.role ==='client' && (
    <>
    {/* add roomie */}
      {/* <div
    onClick={handleNavItemClick}
    className="flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-coffee bg-darkblue p-2 rounded-full">
      <UserPlus2 size={20} color={'white'}/>
      </div>
      <Link href="/listings" onClick={handleNavItemClick}>Roomate Match</Link>
  </div> */}

{/* school focus */}
 {session?.user.school && (
   <div className="flex flex-row items-center gap-2 cursor-pointer">
   <div className="dark:bg-coffee bg-darkblue p-2 rounded-full ">
     <MapPinHouse className="w-5 h-5 text-white" />
      </div>
      <Link 
      href={session?.user.role ==='admin' ? '/admin' : '/agent'} 
      onClick={handleNavItemClick}
      className="w-50 md:w-full text-white bg-darkblue dark:bg-coffee px-4 py-2 rounded-md hover:opacity-95 transition"
      >
        School Focus
    </Link>
    </div>
 )
 }
  </>
  )}

{/* Other Features */}

{/* chats */}
  {session?.user && (
      <div
    onClick={handleNavItemClick}
    className="relative flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-coffee bg-darkblue p-2 rounded-full">
      <MessageSquare size={20} color={'white'}/>
      </div>
      <Link href="/inbox" onClick={handleNavItemClick}>Chats</Link>
      {unreadMessages && parseInt(unreadMessages) > 0 && (
        <div className="flex items-center justify-center absolute w-6 h-6 top-[-16.5%] left-[0%] bg-red-800 text-white rounded-full px-2 py-1 text-xs font-bold">
          {unreadMessages}
        </div>
      )}
  </div>
  
  )}


{/* wishlists */}
     <div
    onClick={handleNavItemClick}
    className="flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-coffee bg-darkblue p-2 rounded-full">
      <Heart size={20} color={'white'}/>
      </div>
      <Link href="/listings/wishlists" onClick={handleNavItemClick}>Wishlist</Link>
  </div>


 {/* Mode */}
  <div
    onClick={() => {
      toggleDarkMode();
      handleNavItemClick();
    }}
    className={` flex flex-row items-center gap-2 cursor-pointer`}
  >
    <div className="dark:bg-coffee bg-darkblue p-2 rounded-full ">
      {darkMode ? (
        <Sun size={20} color="white" />
      ) : (
        <Moon size={20} color="white" />
      )}
    </div>
    <span className="mode">{darkMode ? "Light Mode" : "Dark Mode"}</span>
  </div>

{/* Unique to signed Out */}
  {!session?.user && (
    <>
       <div
    className="flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-coffee bg-darkblue p-2 rounded-full">
      <LogIn size={20} color={'white'}/>
      </div>
     <Link
     href="/login"
     onClick={handleNavItemClick}
     className="w-50 md:w-full text-white bg-darkblue dark:bg-coffee px-4 py-2 rounded-md hover:opacity-95 transition"
     >
      Login
      </Link>
  </div>

     <div
    className="flex flex-row items-center gap-2 cursor-pointer"
  >
    <div className="dark:bg-coffee bg-darkblue p-2 rounded-full">
      <UserPlus size={20} color={ 'white'}/>
      </div>
  <Link href="/signup"
  onClick={handleNavItemClick}
  className="w-50 md:w-full text-darkblue dark:text-coffee border-2 border-darkblue dark:border-coffee px-4 py-2 rounded-md hover:opacity-90 transition"
  >
    Sign Up
    </Link>
  </div>
  
     
    </>
  )}
</div>

</div>
    </header>
  )
}

export default Nav
