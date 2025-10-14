"use client"
import { useContext, useRef, createContext, useState, useEffect } from "react"
import { useNotification } from "@lib/Notification"

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

export const useToast = () => useContext(ToastContext)

const Toast = ({ children }: { children: React.ReactNode }) => {
  const [toastValues, setToastValues] = useState({
    isActive: false,
    message: "",
    status: "",
    duration: 2000,
  })
  const notification = useNotification()
 

  useEffect(() => {
    if (toastValues.isActive) {
      notification.setMessage(toastValues.message)
      notification.setType(toastValues.status)
      notification.setIsActive(true)
      notification.setDuration(toastValues.duration)
    
    }
    const timeout = setTimeout(() => {
      setToastValues((prev) => ({ ...prev, isActive: false }))
    }, 100)
    return () => {
      clearTimeout(timeout)
    }
  }, [toastValues.isActive, toastValues.message, toastValues.status])

  return (
    //  @ts-ignore
    <ToastContext.Provider value={{...toastValues, setToastValues }}>
      {children}
    </ToastContext.Provider>
  )
}

export default Toast
