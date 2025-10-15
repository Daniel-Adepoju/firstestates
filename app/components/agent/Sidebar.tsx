"use client"
import Image from "next/image"
import { client } from "@lib/server/appwrite"
import { Models } from "appwrite"
import { agentSidebarItems as sidebarItems } from "@lib/constants"
import { getUnreadChats } from "@lib/server/chats"
import { usePathname } from "next/navigation"
import { CldImage } from "next-cloudinary"
import { useGetNotifications, useGetRequests } from "@lib/customApi"
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
  const [unreadMessages, setUnreadMessages] = useState<string>("0")

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

  useEffect(() => {
    const getUnreadMessages = async () => {
      const unread = await getUnreadChats(session?.user.id)
      setUnreadMessages(unread)
    }
    getUnreadMessages()

    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID}.documents`,
      (res) => {
        const newMsg = res.payload as Models.Document
        if (newMsg?.userId === session?.user.id) return
        // console.log({newMsgId:newMsg.userId},{userId:session?.user.id})
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
  }, [session])
  const { data: requests, isLoading: requestsLoading } = useGetRequests({ page: "1", limit: 1, enabled: true, agent: session?.user.id })
  const { data, isLoading } = useGetNotifications({ page: "1", limit: 1 })

  console.log(requests,'faa')
  return (
    <div className={`sidebar agentbar ${isCollapse && "reduceBar"}`}>
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
         ${isListings && item.name === "Listings" && "active"}
         `}
              >
                <a href={item.link === "/agent/listings" ? "/agent#listings" : item.link}>
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
                  {item.name === "Chats" && unreadMessages !== "0" && (
                    <div className="absolute flex items-center flex-center w-6 h-6 top-[-16.5%] left-[0%] bg-white  text-white rounded-full px-2 py-1 text-xs font-bold smallNum">
                      {parseInt(unreadMessages) > 99 ? "99+" : unreadMessages}
                    </div>
                  )}
                  {/* unique to requests */}
                  {item.name === "Manage Requests" && (
                    <div className="absolute flex items-center flex-center w-6 h-6 top-[-16.5%] left-[0%] bg-white  text-white rounded-full px-2 py-1 text-xs font-bold smallNum">
                      {requests?.pages[0]?.pendingRequestsLength > 0 && !requestsLoading
                        ? requests?.pages[0]?.pendingRequestsLength > 99
                          ? "99+"
                          : requests?.pages[0]?.pendingRequestsLength
                        : "0"}
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
                  ) : (
                    item.iconLuicide ? <item.iconLuicide /> : null
                  )}
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
    w-full  hover:flex hidden showPriority
    "
      >
        <div
          onClick={() => setIsCollapse((prev) => !prev)}
          className="
     w-10 h-10 rounded-full cursor-pointer
     flex flex-row items-center justify-center
      bg-gray-500/70 shadow-lg mediumScale z-50"
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
