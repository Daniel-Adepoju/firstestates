"use client"

import { useUser } from "@utils/user"
import { CldImage } from "next-cloudinary"
import { useGetAgentsInSchoolFocus } from "@lib/customApi"
import ScrollController from "@components/ScrollController"
import { useRef } from "react"
import { Skeleton } from "@components/ui/skeleton"
const AgentSection = ({ school }: { school: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: agents, isLoading } = useGetAgentsInSchoolFocus({
    school,
    limit: 10,
  })
  
console.log(agents)

  const renderAgents = () => {
    if (!agents?.pages[0].agents.length) {
      return (
        <div className="w-120 py-4 mx-auto text-center text-sm font-medium flex items-center justify-center">
          No agents found
        </div>
      )
    }
    return agents?.pages?.flatMap((item) => {
      return item?.agents.flatMap((agent: Listing["agent"]) => (
        <div
          key={agent._id}
          className="flex flex-col items-center justify-center snap-center"
        >
          <div
            className="
        h-13 w-13 lg:w-15 lg:h-15 relative 
        transition-transform duration-300 hover:scale-105
         cursor-pointer outline-3 outline-gray-300 dark:outline-gray-700 rounded-full p-1.5
      "
          >
            <div className="status-ring"></div>
            <CldImage
              src={agent?.profilePic}
              alt="Profile"
              width={45}
              height={45}
              crop="auto"
              gravity='center'
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div className="mt-1 text-center text-xs font-medium truncate max-w-[4rem]">
            {agent?.username}
          </div>
        </div>
      ))
    })
  }

  const renderLoading = () => {
     return Array.from({length: 30}).map((_,i) => {
     return <div
     key={i}
     className="flex flex-col gap-2 py-4">
        <Skeleton className="w-12 h-12 rounded-full bg-gray-500/20" />
        <Skeleton className="w-12 h-2 rounded-md bg-gray-500/20" />
     </div>
      })
  }

  return (
    <>
      <div className="text-center text-lg font-head font-medium mt-3 mb-1">
        Trusted agents with listings near your school
      </div>
      {!isLoading && <ScrollController scrollRef={scrollRef} />}
      <section
        ref={scrollRef}
        className={`${
          (isLoading || agents?.pages[0].agents.length) &&
          "grid grid-flow-col auto-cols-min whitespace-nowrap mx-auto w-[99.5%] text-sm gap-4 mt-2 px-3 py-4 snap-x snap-mandatory overflow-x-scroll nobar null"
        }   outline-2 outline-gray-100 dark:outline-black rounded-lg`}
      >
        {!isLoading && renderAgents()}
        {isLoading && renderLoading()}
      </section>
    </>
  )
}

export default AgentSection
