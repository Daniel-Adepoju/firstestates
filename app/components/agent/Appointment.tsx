"use client"

import { useState, useEffect } from "react"
import Searchbar from "../Searchbar"
import AppointmentCard from "../agent/AppointmentCard"
import ManageAppointment from "../agent/ManageAppointment"
import { CardProps } from "../Card"
import PopularCard from "../PopularCard"
import { useGetAgentListings } from "@lib/customApi"
import { useGetAppointments } from "@lib/customApi"
import { useUser } from "@utils/user"
import {useSearchParams } from "next/navigation"
import { DotsLoader } from "@utils/loaders"
import Pagination from "@components/Pagination"
import { MoreHorizontal } from "lucide-react"
import ScrollController,{scrollRef} from "@components/ScrollController"

const Appointment = () => {
  const { session } = useUser()
  const params = useSearchParams()
  const page = params.get("page") || "1"
  const [agentId, setAgentId] = useState("")
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")

  // listings data
  const { data, isLoading } = useGetAgentListings({
    id: agentId,
    enabled: !!agentId && !!debounced,
    page:'1',
    limit: 100,
    school: debounced,
    location: debounced,
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
    }, 560)
    return () => clearTimeout(timeoutId)
  }, [search])

  const mapCards = data?.listings?.map((item: CardProps["listing"]) => {
    return (
      <PopularCard
        key={item._id}
        listing={item}
        type={'appointment'}
      />
    )
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
              find a listing to schedule inspection
            </h2>
            <Searchbar
              search={search}
              setSearch={(e) => setSearch(e.target.value)}
              placeholder="Search your listings"
              className="dark:text-gray-200 gap-1 w-full flex flex-row justify-center items-center   "
            />

            {/* listings */}
              <ScrollController />
         {isLoading ? (
                <div className="my-4 ">
                  <DotsLoader />
                </div>)
                 :
                 (
                <div 
            ref={scrollRef}
            className="popularList dark:text-white w-full  overflow-x-auto grid grid-flow-col gap-x-4 pb-4">
            
            
                <>
               
               {mapCards}
                </>
                </div>
              )}
           
          </div>
        </div>

        <div className="appointments w-full self-start">
          <h3 className="otherHead text-lg font-bold mx-auto text-center">Pending Inspections</h3>
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
