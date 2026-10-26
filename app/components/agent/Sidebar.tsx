"use client"

import { agentSidebarItems as sidebarItems } from "@lib/constants"
import { usePathname } from "next/navigation"
import { CldImage } from "next-cloudinary"
import { useEffect, useState } from "react"
import { useGetNotifications, useGetRequests, useGetUnreadCount } from "@lib/customApi"
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"

interface Session { session: { user: { id: string; username: string; email: string; profilePic: string } } }

const Sidebar = ({ session }: Session) => {
  const pathname = usePathname()
  const [hash, setHash] = useState("")
  const [isCollapse, setIsCollapse] = useState(false)
  const { unreadCount } = useGetUnreadCount()
  const { data: requests, isLoading: requestsLoading } = useGetRequests({ page: "1", limit: 1, enabled: true, agent: session.user.id })
  const { data, isLoading } = useGetNotifications({ page: "1", limit: 1 })

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    onHashChange()
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return (
    <aside className={`dashboard-sidebar dashboard-sidebar--agent bar-custom gold-bar ${isCollapse ? "dashboard-sidebar--collapsed" : ""}`}>
      <div className="dashboard-sidebar__brand"><div className="dashboard-sidebar__mark"><BuildingMark /></div>{!isCollapse && <div><p className="dashboard-sidebar__eyebrow">First Estates</p><p className="dashboard-sidebar__title">Agent Dashboard</p></div>}</div>
      <nav aria-label="Agent navigation" className="dashboard-sidebar__nav"><p className="dashboard-sidebar__section">Manage</p>
        {sidebarItems.filter((item) => item.name !== "Dashboard").map((item) => {
          const Icon = item.iconLucide as React.ComponentType<{ size?: number; strokeWidth?: number }>
          const isActive = hash !== "#listings" && (pathname === item.link || (pathname.startsWith(item.link + "/") && item.link !== "/agent"))
          const count = item.name === "Messages" ? data?.pages[0]?.unreadNotifications : item.name === "Chats" ? Number(unreadCount) : item.name === "Manage Requests" ? requests?.pages[0]?.pendingRequestsLength : 0
          return <a key={item.name} href={item.link} aria-current={isActive ? "page" : undefined} className={`dashboard-sidebar__item ${isActive ? "is-active" : ""}`} title={isCollapse ? item.name : undefined}><span className="dashboard-sidebar__icon"><Icon size={24} strokeWidth={2.1} /></span>{!isCollapse && <span className="dashboard-sidebar__label">{item.name}</span>}{!isCollapse && <ChevronRight size={16} className="dashboard-sidebar__chevron" />}{!isLoading && !requestsLoading && count > 0 && <span className="dashboard-sidebar__badge">{count > 99 ? "99+" : count}</span>}</a>
        })}
      </nav>
      <button type="button" onClick={() => setIsCollapse((value) => !value)} className="dashboard-sidebar__collapse" aria-label={isCollapse ? "Expand sidebar" : "Collapse sidebar"}>{isCollapse ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}{!isCollapse && <span>Collapse menu</span>}</button>
      <div className="dashboard-sidebar__profile"><CldImage src={session.user.profilePic} alt="Profile" width={40} height={40} crop="auto" className="dashboard-sidebar__avatar" />{!isCollapse && <div className="dashboard-sidebar__details"><strong>{session.user.username}</strong><span>{session.user.email}</span></div>}</div>
    </aside>
  )
}

const BuildingMark = () => <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8"><path d="M4 20V5.5L12 2l8 3.5V20M4 20h16M8 8h1m6 0h1M8 12h1m6 0h1M8 16h1m6 0h1M11 20v-4h2v4" /></svg>

export default Sidebar
