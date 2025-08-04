'use client'
import { useEffect,useRef } from 'react'
import {useNotification} from '@lib/Notification'

const Toast = ({isActive,setIsActive,message,status}) => {
      const notification = useNotification() 
      const wasActive = useRef(false)
      useEffect(() => {
      if (isActive) {
      notification.setMessage(message)
      notification.setType(status)
      notification.setIsActive(true)
      wasActive.current = true
    }
      const timeout = setTimeout(() => {
        setIsActive((prev) => ({...prev, isActive:false}))
      }, 100)
      return () => {
        clearTimeout(timeout)
      }

      },[isActive,message,status])

  return (
   <></>
  )
}

export default Toast