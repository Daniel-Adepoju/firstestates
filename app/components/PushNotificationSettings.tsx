"use client"
import { Bell, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { registerPushNotifications } from "./PushNotificationRegistrar"
import { firebaseConfigured } from "@lib/firebase/client"

export default function PushNotificationSettings() {
  const [status, setStatus] = useState<"idle" | "working" | "enabled" | "error">("idle")
  const enable = async () => {
    setStatus("working")
    try { const permission = await Notification.requestPermission(); if (permission !== "granted" || !(await registerPushNotifications())) throw new Error("Permission or setup was not completed"); setStatus("enabled") } catch { setStatus("error") }
  }
  return <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-secondary/55 p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{status === "enabled" ? <CheckCircle2 size={19} /> : <Bell size={19} />}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Push notifications</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">Receive new message and account notifications on this device.</span></span><button type="button" disabled={!firebaseConfigured || status === "working" || status === "enabled"} onClick={enable} className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">{!firebaseConfigured ? "Configure Firebase" : status === "enabled" ? "Enabled" : status === "working" ? "Enabling…" : status === "error" ? "Try again" : "Enable"}</button></div>
}
