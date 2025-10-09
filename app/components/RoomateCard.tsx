import { CldImage } from "next-cloudinary"
import Image from "next/image"
import { AlertTriangle, ArrowLeft, ArrowRight, Bookmark, MapPin, MessageCircle } from "lucide-react"
import { useState } from "react"

import React from 'react'
import Button from "@lib/Button"
import { truncateAddress } from "@utils/truncateAddress"

const RoomateCard = () => {
    const [showListing,setShowListing] = useState(false)
  return (
  !showListing ? (
      <div className="snap-center bg-darkblue dark:bg-coffee w-90 h-50 rounded-sm p-2 mx-auto ">
        <div className="flex flex-col">
        <Button
        className="clickable directional border-20 border-red-700 text-white  h-32 mb-2  mt-[-4px] shadow-md"
        text="Show Listing"
        functions={()=> setShowListing(true)}
        ></Button>
          <Image
            src="/images/agent.jpg"
            alt="ee"
            width={60}
            height={60}
            className="rounded-full mx-auto"
          />
          <div className="text-white mx-auto">Username</div>

          {/* options row */}
          <div className="w-full flex flex-row justify-around mt-2">
            <div className="flex items-center gap-1 text-white font-bold">
              <MessageCircle
                size={30}
                color="white"
              />
              <span>Chat</span>
            </div>

             <div className="flex items-center gap-1 text-white font-bold">
              <Bookmark
                size={30}
                color="white"
              />
              <span>Bookmark</span>
            </div>

             <div className="flex items-center gap-1 text-white font-bold">
              <AlertTriangle
                size={30}
                color="white"
              />
              <span>Report</span>
            </div>
          </div>


          {/* message row */}
          <div className="w-full h-35 bg-white dark:bg-gray-700  shadow-md rounded-md mt-2.5 p-2 overflow-y-scroll nobar null border-1 border-black/30 dark:border-white/50">
            <p className="text-sm text-gray-700 dark:text-white">
              Hello, I am looking for a roommate near UCSD. I am clean and responsible. If you are
              interested, please reach out! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, quibusdam. Atque reiciendis odit modi quos fugiat! Culpa adipisci, exercitationem excepturi officiis necessitatibus repellendus fugiat dignissimos magni eius, labore corrupti natus.
            </p>
          </div>
        </div>
      </div>
  )
      : (
        <div className="snap-center bg-darkblue dark:bg-coffee w-90 h-80 rounded-sm p-2 mx-auto ">
            <div className="flex flex-col w-full">
        <Button
        className="clickable directional border-20 border-red-700 text-white  h-32 mb-2  mt-[-4px] shadow-md"
        text="Show Applicant"
        functions={()=>{setShowListing(false)}}
        ></Button>
          <Image
            src="/images/house3.jpg"
            alt="ee"
            width={150}
            height={100}
            className="rounded-lg mx-auto w-full h-40 object-fill"
          />
          </div>
          {/* options row */}
          <div className="w-full flex flex-col items-center justify-center gap-1.5 mt-2">
            <div className="flex items-center gap-1 text-white font-bold">
              <MapPin
                size={30}
                color="white"
              />
              <span>Iyana-School</span>
            </div>
            <p className="text-white">{truncateAddress('14,lorem ipsum dolor ghjooooopppppppppppppppppppppp',38)}</p>
            <div className="flex items-center gap-1 text-white font-bold cursor-pointer">
              <ArrowRight
                size={30}
                color="white"
              />
              <span>View Listing</span>
            </div>
          </div>

          </div>
      )
  )
}

export default RoomateCard
