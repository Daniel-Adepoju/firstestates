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
  const [appointmentType, setAppointmentType] = useState("")
  const [clientName, setClientName] = useState("")
  const [warning, setWarning] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)

  const { data, isLoading } = useGetSingleListing(id, true)

  const createAppointment = async (val: any) => {
    const res = await axiosdata.value.post("/api/listings/appointment", val)
    setAppointmentType("")
    setClientName("")
    if (res.status === 201) {
      router.back()
    }
  }

  const appointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })

  const handleCreateAppointment = () => {
    if (!appointmentType) {
      setWarning("Pick appointment type")
    } else if (!clientName) {
      setWarning("Client name should not be empty")
    } else {
      setWarning("")
      appointmentMutation.mutate({
        appointmentType,
        // clientID,
        date,
        clientName,
        listingID: id,
      })
    }
  }

  if (isLoading) {
    return (
      <MoreHorizontal
        size={50}
        color="grey"
        className="mt-50 mx-auto animate-pulse"
      />
    )
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
        {/* ========= WHY DETAILS ==============*/}
        <details>
          <summary
            className="cursor-pointer text-sm underline underline-offset-6
        text-gray-600 dark:text-gray-300 mx-auto"
          >
            Why set an appointment?
          </summary>
          <div className="hyphens-auto w-[98%] mt-3 text-sm font-medium font-head text-gray-800 dark:text-gray-200 flex flex-col items-center  lg:flex-row break-words tracking-wide leading-6 px-2">
            <p className="w-full text-justify">
              Setting an appointment allows you to schedule property viewings with clients, ensuring
              a structured and efficient process. It helps in managing your time effectively,
              providing clients with a professional experience, and keeping track of upcoming
              viewings.
            </p>
            <p className="w-full text-justify mt-2 lg:mt-0 lg:ml-4">
              Additionally, appointments can enhance communication and reduce scheduling conflicts,
              ultimately leading to better client satisfaction and increased chances of closing
              deals.
            </p>
          </div>
        </details>

{/* ============== VISIT TYPES ==============*/}
        <details>
          <summary
            className="cursor-pointer text-sm underline underline-offset-6
        text-gray-600 dark:text-gray-300 mx-auto"
          >
            Visit Types Explained
          </summary>
          <div className="hyphens-auto w-[98%] mt-3 text-sm font-medium font-head text-gray-800 dark:text-gray-200 flex flex-col items-center  lg:flex-row break-words tracking-wide leading-6 px-2">
            <p className="w-full text-justify">
              <span className="font-bold bg-gray-700 text-background dark:bg-gray-50 px-2 p-1 rounded-sm">
                Initial Visit:
              </span>{" "}
              This is the first meeting between the agent and the client. The purpose is to
              understand the client's needs, preferences, and budget. The agent may also ask
              questions about the property, its features, and any specific requirements the client
              has.
            </p>
            <p className="w-full text-justify mt-2 lg:mt-0 lg:ml-4">
              <span className="font-bold bg-gray-700 text-background dark:bg-gray-50 px-2 p-1 rounded-sm">
                Revisit:
              </span>{" "}
              This is a follow-up meeting scheduled after the initial visit. The purpose is to
              discuss any further questions, address any concerns, and provide updates on the
              property. Revisits help in closing deals more effectively.
            </p>
            <p className="w-full text-justify mt-2 lg:mt-0 lg:ml-4">
              <span className="font-bold bg-gray-700 text-background dark:bg-gray-50 px-2 p-1 rounded-sm">
                Final Visit:
              </span>{" "}
              This is the concluding meeting where the client and the agent agree on the terms of
              the deal. It is typically a short meeting to finalize the sale or rental agreement.
            </p>
          </div>
        </details>


        {/* ============== APPOINTMENT FORM ==============*/}
        <form className="flex-1 form appoint flex flex-col gap-3">
          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex flex-col gap-2">
              <label>Type Of Visit</label>

              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="dark:bg-darkGray"
              >
                <option value="">Select apointment type</option>
                <option value="initial">Initial</option>
                <option value="revisit">Revisit</option>
                <option value="final">Final</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label>Client Name</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                type="text"
                placeholder="Client Name"
              />
            </div>
          </div>
        </form>
        {warning && <div className="mx-auto text-sm text-red-500">{warning}</div>}
        <Button
          disabled={!appointmentType && !clientName}
          functions={() => handleCreateAppointment()}
          text="Create Appointment"
          className="clickable directional font-medium text-sm darkblueBtn w-60 mx-auto py-6"
        >
          {appointmentMutation.isPending && (
            <Loader2
              color="white"
              size={30}
              className="animate-spin"
            />
          )}
        </Button>
      </div>
    </div>
  )
}

export default SetAppointmentForListing
