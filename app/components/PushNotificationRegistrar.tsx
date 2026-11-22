"use client"
import { useEffect } from "react"
import { getToken, onMessage } from "firebase/messaging"
import { getBrowserMessaging, firebaseConfigured } from "@lib/firebase/client"
import { useUser } from "@utils/user"

export async function registerPushNotifications() {
  if (typeof window === "undefined" || !firebaseConfigured || !("serviceWorker" in navigator)) return false
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js")
  const messaging = await getBrowserMessaging()
  if (!messaging) return false
  const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, serviceWorkerRegistration: registration })
  if (!token) return false
  const response = await fetch("/api/notifications/devices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, platform: "web" }) })
  return response.ok
}

export default function PushNotificationRegistrar() {
  const { session } = useUser()
  useEffect(() => {
    if (!session?.user?.id || !firebaseConfigured || typeof window === "undefined" || !("serviceWorker" in navigator)) return
    let dispose = () => {}
    const register = async () => {
      try {
        const messaging = await getBrowserMessaging()
        if (!messaging) return
        await registerPushNotifications()
        dispose = onMessage(messaging, payload => { if (payload.notification?.title && Notification.permission === "granted") new Notification(payload.notification.title, { body: payload.notification.body, icon: "/logo/favicon.png" }) })
      } catch (error) { console.warn("Push notification registration skipped", error) }
    }
    if (Notification.permission === "granted") register()
    return () => dispose()
  }, [session?.user?.id])
  return null
}
