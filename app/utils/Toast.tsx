"use client"
import { useContext, createContext, useState, useEffect } from "react"
import { toast as sonnerToast } from "sonner"

type ToastContextType = {
  isActive: boolean
  message: string
  status: string
  duration?: number | undefined
  setToastValues: React.Dispatch<
    React.SetStateAction<{
      isActive: boolean
      message: string
      status: string
      duration?:number | undefined
    }>
  >
}

export const ToastContext = createContext<ToastContextType>({
  isActive: false,
  message: "",
  status: "",
  duration: 2000,
  setToastValues: () => {},
})

type NotificationBridge = {
  setMessage: (message: string) => void
  setIsActive: (active: boolean) => void
  setType: (type: string) => void
  setDuration: (duration?: number) => void
}

const NotificationContext = createContext<NotificationBridge>({
  setMessage: () => {}, setIsActive: () => {}, setType: () => {}, setDuration: () => {},
})

export const useToast = () => useContext(ToastContext)
export const useNotification = () => useContext(NotificationContext)

const Toast = ({ children }: { children: React.ReactNode }) => {
  const [toastValues, setToastValues] = useState({
    isActive: false,
    message: "",
    status: "",
    duration: 2000,
  })
  const [notificationValues, setNotificationValues] = useState({
    isActive: false,
    message: "",
    status: "success",
    duration: 2000,
  })

  useEffect(() => {
    if (toastValues.isActive) {
      const notify = sonnerToast[toastValues.status as "success" | "error" | "warning" | "info"] || sonnerToast
      notify(toastValues.message, { duration: toastValues.duration })
    }
    const timeout = setTimeout(() => {
      setToastValues((prev) => ({ ...prev, isActive: false }))
    }, 100)
    return () => {
      clearTimeout(timeout)
    }
  }, [toastValues.isActive, toastValues.message, toastValues.status])

  useEffect(() => {
    if (!notificationValues.isActive || !notificationValues.message) return
    const notify = sonnerToast[notificationValues.status as "success" | "error" | "warning" | "info"] || sonnerToast
    notify(notificationValues.message, { duration: notificationValues.duration })
    setNotificationValues((prev) => ({ ...prev, isActive: false }))
  }, [notificationValues])

  const notificationBridge: NotificationBridge = {
    setMessage: (message) => setNotificationValues((prev) => ({ ...prev, message })),
    setIsActive: (isActive) => setNotificationValues((prev) => ({ ...prev, isActive })),
    setType: (status) => setNotificationValues((prev) => ({ ...prev, status })),
    setDuration: (duration = 2000) => setNotificationValues((prev) => ({ ...prev, duration })),
  }

  return (
    //  @ts-ignore
    <NotificationContext.Provider value={notificationBridge}>
      <ToastContext.Provider value={{...toastValues, setToastValues }}>
        {children}
      </ToastContext.Provider>
    </NotificationContext.Provider>
  )
}

export default Toast
