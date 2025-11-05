"use client"

import { useState, useEffect, useRef} from "react"
import Searchbar from "../Searchbar"
import AppointmentCard from "../agent/AppointmentCard"
import ManageAppointment from "../agent/ManageAppointment"
import PopularCard from "../PopularCard"
import { useGetAgentListingsInfinite } from "@lib/customApi"
import { useGetAppointments } from "@lib/customApi"
import { useUser } from "@utils/user"
import {useSearchParams } from "next/navigation"
import Pagination from "@components/Pagination"
import { MoreHorizontal, Loader2 } from "lucide-react"
import ScrollController from "@components/ScrollController"
import { Skeleton } from "@components/ui/skeleton"
import { useNextPage } from "@lib/useIntersection"

const Appointment = () => {
  const { session } = useUser()
  const params = useSearchParams()
  const page = params.get("page") || "1"
  const [agentId, setAgentId] = useState("")
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
  // listings data
  const { data, isLoading,isFetchingNextPage,fetchNextPage,hasNextPage } = useGetAgentListingsInfinite({

    id: agentId,
    enabled: !!agentId,
    page:'1',
    limit: 10,
    school: debounced,
    location: debounced,
  })

  const useNextPageRef = useNextPage({
    isLoading,
    hasNextPage,
    fetchNextPage,
  }) 

  //  appointment data
  const {data:appointments, isLoading:appointmentLoading} = useGetAppointments({page,limit:10})
  
  // effects

  useEffect(() => {
    if (session?.user.id && !agentId) {
      setAgentId(session.user.id)
    }
  }, [session, agentId])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounced(search)
        if (scrollRef?.current) {
    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  }

    }, 560)
    return () => clearTimeout(timeoutId)
  }, [search])

  const mapCards = data?.pages?.flatMap((item) => {
    return item.listings.map((listing: Listing, index:number) => {
      return (
        <PopularCard
          key={listing._id}
          listing={listing}
          type={'appointment'}
          refValue={index === item.listings.length - 1 ? useNextPageRef : null}
        />
      )
    })
  })

  return (
    <>
      <h1 className="otherHead text-xl font-bold"> Inspection Dashboard </h1>
      <div className="flex flex-col items-center  mt-3 mx-auto w-full gap-3">
        <div className="w-full flex flex-col  justify-between gap-3 ">
          <div className="flex flex-col items-center gap-3">
 
              <ManageAppointment 
              lastAppointment={appointments?.lastAppointment?.date}
              nextAppointment={appointments?.nextAppointment?.date}
              />
      
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <h2 className="otherHead text-md font-bold capitalize text-center">
              Schedule inspection
            </h2>
                     <h6 className="text-sm text-center font-light text-gray-600 dark:text-gray-300">
              Recent listings are displayed by default. You can search by school or location to schedule an appointment.
                     </h6> 
            <Searchbar
              search={search}
              setSearch={(e) => setSearch(e.target.value)}
              placeholder="Search your listings"
              className="dark:text-gray-200 gap-1 w-full flex flex-row justify-center items-center"
            />

            {/* listings */}
            {agentId &&  <ScrollController scrollRef={scrollRef} />}
                <div
            ref={scrollRef}
            className="popularList dark:text-white w-full 
             overflow-x-auto grid grid-flow-col gap-x-4 pb-4">
         {isLoading ?
        (<>
         {Array.from({length:12}).map((_,i) => (
           <Skeleton key={`skeleton-${i}`} className="animate-none bg-gray-500/20 w-40 h-40" />
         ))}
         </>)
                 :  
                 (
                <>
               {mapCards}
         {isFetchingNextPage && 
         <Loader2 className="animate-spin mx-auto my-auto text-gray-700 dark:text-white"/>}
                </>
              
              )}
             </div> 
          </div>
        </div>

        <div className="appointments w-full self-start">
          <h3 className="otherHead text-lg font-bold mx-auto text-center ">Pending Inspections</h3>
           <h6 className="text-sm text-center text-gray-600 dark:text-gray-300 font-semibold">A reminder email will be sent to you before your appointment's due date</h6>
          <h6 className="text-sm text-center font-light text-gray-600 dark:text-gray-300">Expired appointments are removed on a weekly schedule</h6>
          <div className="mt-4 grid grid-cols-4 text-center border-gray-500/20">
            <div className="dark:text-white border-1 border-gray-500/40 ">Image</div>
            <div className="dark:text-white border-1 border-gray-500/40 "> Date</div>
            <div className="dark:text-white border-1 border-gray-500/40 ">Client</div>
            <div className="dark:text-white border-1 border-gray-500/40 ">Type</div>
          </div>

       {appointmentLoading ? 
       <MoreHorizontal size={50} color='grey' className="animate-pulse mx-auto" />
       : appointments?.posts?.map((item:any, i:number) => (
            <AppointmentCard
              key={item._id}
              data={item}
              firstCard={i}
            />
          ))
        }
        </div>

      <Pagination 
      totalPages={appointments?.numOfPages}
      currentPage={appointments?.cursor}
      />
      </div>
    </>
  )
}

export default Appointment
