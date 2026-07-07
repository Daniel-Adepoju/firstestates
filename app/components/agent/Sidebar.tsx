"use client"
import Image from "next/image"
import { agentSidebarItems as sidebarItems } from "@lib/constants"
import { usePathname } from "next/navigation"
import { CldImage } from "next-cloudinary"
import { useGetNotifications, useGetRequests, useGetUnreadCount } from "@lib/customApi"
import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface Session {
  session: {
    user: {
      id: string
      username: string
      email: string
      profilePic: string
    }
  }
}

const Sidebar = ({ session }: Session) => {
  const pathname = usePathname()
  const [hash, setHash] = useState("")
  const [isCollapse, setIsCollapse] = useState(false)
  const {unreadCount} = useGetUnreadCount()

  useEffect(() => {
    const onHashChange = () => {
      const hashVal = window.location.hash
      setHash(hashVal)
    }
    window.addEventListener("hashchange", onHashChange)

    return () => {
      window.removeEventListener("hashchange", onHashChange)
    }
  }, [])


  const { data: requests, isLoading: requestsLoading } = useGetRequests({
    page: "1",
    limit: 1,
    enabled: true,
    agent: session?.user.id,
  })
  const { data, isLoading } = useGetNotifications({ page: "1", limit: 1 })

  return (
    <div className={`sidebar agentbar ${isCollapse && "reduceBar"} z-90`}>
      <ul>
        {sidebarItems.map((item, index) => {
          const isListings = hash === "#listings"
          let isActive
          if (isListings) isActive = false
          if (!isListings)
            isActive =
              pathname === item.link ||
              (pathname.startsWith(item.link + "/") && item.link !== "/agent")
          return (
            item.name !== "Dashboard" && (
              <div
                key={index}
                className={`relative items 
         ${isActive && "active"}
     
         `}
              >
                <a href={item.link}>
                  {/* unique to notification messages */}
                  {item.name === "Messages" &&
                    !isLoading &&
                    data?.pages[0]?.unreadNotifications > 0 && (
                      <div className="z-1  h-6 w-6 absolute top-[-16.5%] left-[0%] text-center bg-white rounded-full text-xs font-bold smallNum">
                        {data?.pages[0]?.unreadNotifications > 99
                          ? "99+"
                          : data?.pages[0].unreadNotifications}
                      </div>
                    )}
                  {/* unique to chats */}
                  {item.name === "Chats" && unreadCount !== 0 && (
                    <div className="absolute flex items-center flex-center w-6 h-6 top-[-16.5%] left-[0%] bg-white  text-white rounded-full px-2 py-1 text-xs font-bold smallNum">
                      {parseInt(unreadCount) > 99 ? "99+" : unreadCount}
                    </div>
                  )}
                  {/* unique to requests */}
                  {item.name === "Manage Requests" &&
                    requests?.pages[0]?.pendingRequestsLength > 0 &&
                    !requestsLoading && (
                      <div className="absolute flex items-center flex-center w-6 h-6 top-[-16.5%] left-[0%] bg-white  text-white rounded-full px-2 py-1 text-xs font-bold smallNum">
                        {requests?.pages[0]?.pendingRequestsLength > 99
                          ? "99+"
                          : requests?.pages[0]?.pendingRequestsLength}
                      </div>
                    )}
                  {/* icons config */}
                  {item.icon ? (
                    <Image
                      src={item.icon}
                      alt="icons"
                      width={30}
                      height={30}
                    />
                  ) : item.iconLuicide ? (
                    <item.iconLuicide />
                  ) : null}
                  <li>{item.name}</li>
                </a>
              </div>
            )
          )
        })}
      </ul>
      {/* collapsible arrow */}
      <div
        className="
       arrow absolute top-65 left-[94%]
    w-full hover:flex hidden
    "
      >
        <div
          onClick={() => setIsCollapse((prev) => !prev)}
          className="
     w-10 h-10 rounded-full cursor-pointer
     flex flex-row items-center justify-center
      bg-gray-500/70 shadow-lg mediumScale"
        >
          {isCollapse ? (
            <ArrowRight
              size={30}
              color="white"
            />
          ) : (
            <ArrowLeft
              size={30}
              color="white"
            />
          )}
        </div>
      </div>

      <div className="adminLabel justify-end">
        {session && (
          <CldImage
            src={session?.user?.profilePic}
            alt="profile pic"
            width={30}
            height={30}
            crop={"auto"}
          />
        )}
        <div className="adminDetails">
          <span>{session?.user.username}</span>
          <span>{session?.user.email}</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
