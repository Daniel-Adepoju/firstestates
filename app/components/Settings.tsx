"use client"
import { useRouter } from "next/navigation"
import { Sun, Moon, LogOut, User, ChevronRight, Settings2 } from "lucide-react"
import { useDarkMode } from "@lib/DarkModeProvider"
import { useEffect, useRef, useState } from "react"
import { LogOutModal } from "./Modals"
import { axiosdata } from "@utils/axiosUrl"
import PushNotificationSettings from "./PushNotificationSettings"

interface SettingProps {
  editProfile: string
}

export default function Settings({ editProfile }: SettingProps) {
  const router = useRouter()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const logOutRef = useRef<HTMLDialogElement>(null)
  const [feed, setFeed] = useState("all")
  const [locationFeed, setLocationFeed] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    axiosdata.value.get("/api/users/settings").then(({ data }) => {
      setFeed(data.settings?.defaultFeed || "all")
      setLocationFeed(Boolean(data.settings?.locationFeed))
    }).catch(() => {})
  }, [])

  const saveDiscovery = async (next: { defaultFeed?: string; locationFeed?: boolean }) => {
    setSaving(true)
    try { await axiosdata.value.patch("/api/users/settings", next) } finally { setSaving(false) }
  }

  const openDialog = () => {
    logOutRef.current?.showModal()
  }
  const handleEditProfile = () => {
    router.push(editProfile)
  }

  return (
    <section className="w-full rounded-3xl border border-border/60 bg-background/55 p-4 shadow-sm backdrop-blur-md sm:p-6">
      <div className="mb-6 flex items-start gap-3 border-b border-border/50 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Settings2 size={21} />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Settings</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Manage your profile, appearance, and account access.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-border/50 bg-secondary/55 p-4">
          <h3 className="text-sm font-semibold">Feed and discovery</h3>
          <label className="mt-3 block text-xs text-muted-foreground" htmlFor="default-feed">Default listing category</label>
          <select id="default-feed" value={feed} disabled={saving} onChange={(event) => { setFeed(event.target.value); saveDiscovery({ defaultFeed: event.target.value }) }} className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm">
            <option value="all">All listings</option><option value="student">Students</option><option value="residential">Residential</option>
          </select>
          <label className="mt-4 flex items-center gap-3 text-sm"><input type="checkbox" checked={locationFeed} disabled={saving} onChange={(event) => { setLocationFeed(event.target.checked); saveDiscovery({ locationFeed: event.target.checked }) }} /> Use location to personalize discovery when available</label>
        </div>
        <PushNotificationSettings />
        <button
          onClick={handleEditProfile}
          className="group flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-secondary/55 px-4 py-4 text-left text-foreground transition-colors hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Edit Profile</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              Update your personal and contact details.
            </span>
          </span>
          <ChevronRight
            size={18}
            className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          />
        </button>

        <button
          onClick={() => toggleDarkMode()}
          className="group flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-secondary/55 px-4 py-4 text-left text-foreground transition-colors hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-goldPrimary/15 text-goldPrimary">
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {darkMode ? "Switch to a brighter appearance." : "Switch to a darker appearance."}
            </span>
          </span>
          <span className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {darkMode ? "On" : "Off"}
          </span>
        </button>

        <button
          onClick={openDialog}
          className="group flex w-full items-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-4 text-left text-destructive transition-colors hover:border-destructive/40 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <LogOut size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Log Out</span>
            <span className="mt-1 block text-xs leading-5 text-destructive/75">
              Sign out of your First Estates account.
            </span>
          </span>
          <ChevronRight
            size={18}
            className="shrink-0 text-destructive/70 transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <LogOutModal ref={logOutRef} />
    </section>
  )
}
