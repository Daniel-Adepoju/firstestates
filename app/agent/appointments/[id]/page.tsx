"use client"
import { useGetSingleListing } from "@lib/customApi"
import { useParams, useRouter } from "next/navigation"
import SetAppointment from "@components/agent/SetAppointment"
import { useState } from "react"
import { Loader2, MoreHorizontal } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import Button from "@lib/Button"

const SetAppointmentForListing = () => {
    const queryClient = useQueryClient()
const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [appointmentType, setAppointmentType] = useState('')
  const [clientName,setClientName] = useState('')
       const [date, setDate] = useState<Date | undefined>(undefined)

  const { data, isLoading } = useGetSingleListing(id, true)
  

   const createAppointment = async (val: any) => {
    const res = await axiosdata.value.post('/api/listings/appointment',val)
    setAppointmentType('')
    setClientName('')
}


  const appointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['appointments']})
      router.back()
    }
  })

  const handleCreateAppointment = () => {
    appointmentMutation.mutate({
        appointmentType,
        // clientID,
        date,
        clientName,
        listingID: id,

    })
  }


  if (isLoading) {
    return <MoreHorizontal size={50} color='grey' className='mt-50 mx-auto animate-pulse'/>
  }

  return (
    <div
      className="w-full dark:text-white flex flex-col items-center 
    lg:flex-row lg:justify-evenly lg:items-start gap-4"
    >
      <SetAppointment 
      date={date}
      setDate={setDate}
      />
      <div className="w-full flex flex-col gap-4">
        <div className="otherHead text-md font-bold self-center">Fill Viewing Details</div>
        <form className="flex-1 form appoint flex flex-col gap-3">
          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex flex-col gap-2">
              <label>Type Of Visit</label>

              <select 
              value={appointmentType}
              onChange={(e)=>setAppointmentType(e.target.value)}
              className="dark:bg-gray-600">
                <option value=''>Select apointment type</option>
                <option value="initial">Initial</option>
                <option value="revisit">Revisit</option>
                <option value="final">Final</option>
              </select>
             
            </div>
            <div className="w-full flex flex-col gap-2">
              <label>Client Name</label>
              <input
              value={clientName}
              onChange={(e)=>setClientName(e.target.value)}
                type="text"
                placeholder="Client Name"
              />
            </div>
          </div>
        </form>
         <Button
      functions={() => handleCreateAppointment()}
      text="Create Appointment"
      className="clickable directional darkblueBtn w-60 mx-auto"
      >
      {appointmentMutation.isPending && <Loader2 color="white" size={30} className="animate-spin"/>}
      </Button>
      </div>
     
    </div>
  )
}

export default SetAppointmentForListing
