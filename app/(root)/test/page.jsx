"use client"
import { useSignal } from "@preact/signals-react/runtime"
// import { useNotification } from "@components/Notification"
import React from "react"

const Page = () => {
  const val = useSignal(true)



  return (
    <>
      {/* <Notification  isActive={val.value} /> */}

      <button
        style={{ margin: "200px auto" }}
        onClick={qw}
      >
        {/* {notification} */} Click
      </button>
    </>
  )
}

export default Page
