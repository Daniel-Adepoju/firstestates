"use client"

import ListingTypes from "@components/agent/create_listing/ListingTiers"
import { CldVideoPlayer } from "next-cloudinary"
const Page = () => {
  return (
    <>
      <div className="w-[400px] aspect-video">
        <CldVideoPlayer
          src={"mixkit-black-ink-splashing-505-hd-ready_elc7t8"}
          controls={true}
          // autoPlay={true}
          width="620"
          height="520"
          colors={{
            accent: "#032679",
            base: "black",
            text: "#F29829",
          }}
          logo={false}
          className="mt-4 rounded-md"
        />
      </div>
    </>
  )
}

export default Page
//
