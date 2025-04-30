"use client"
import { useSignal } from "@preact/signals-react/runtime"
// import { useNotification } from "@components/Notification"
import React from "react"

const Page = () => {

  return (
    <>
      {/* <Notification  isActive={val.value} /> */}

      <button
        style={{ margin: "200px auto" }}
        onClick={() => {return}}
      >
        {/* {notification} */} Click
      </button>
    </>
  )
}

export default Page
