import { axiosdata } from "@utils/axiosUrl"
import { parseDate } from "@utils/date"
import { Loader2, Trash } from "lucide-react"
import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@utils/Toast"
import { useState } from "react"

interface AppointmentCardProps {
  firstCard: number
  data: any
}

const AppointmentCard = ({ firstCard, data }: AppointmentCardProps) => {
  const queryClient = useQueryClient()
  const { setToastValues } = useToast()

  const deleteFn = async (val: { appointmentId: string }) => {
    try {
      await axiosdata.value.delete("/api/listings/appointment", {
        data: val,
      })
      setToastValues({
        isActive: true,
        message: "Appointment Deleted",
        status: "success",
        duration: 2000,
      })
    } catch (err) {
      setToastValues({
        isActive: true,
        message: "Failed to delete appointment, try again",
        status: "danger",
        duration: 2000,
      })
    }
  }

  const deleteAppointmentMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })

  const handleDeleteAppointment = () => {
    deleteAppointmentMutation.mutate({ appointmentId: data._id })
  }

  return (
    <>
      <div
        className={`${firstCard === 0 && "mt-5"} appointment_item dark:text-white
    grid grid-cols-4 items-center  p-2 self-start w-full gap-2 shadow-sm dark:shadow-gray-700 text-center break-words
    `}
      >
        <div>
          <Link
            href={`/agent/listings/single_listing?id=${data.listingID._id}`}
            target="_blank"
            className="mx-auto block"
          >
            <CldImage
              src={data.listingID.mainImage}
              width={100}
              height={100}
              crop={"fit"}
              gravity="center"
              alt="house"
              className="rounded-md mx-auto"
            />
          </Link>
        </div>

        <div>{parseDate(data.date)}</div>
        <div> {data.clientName}</div>
        <div
          className={`
      ${data.appointmentType === "final" && "bg-slate-600"}
       ${data.appointmentType === "initial" && "bg-green-600"}
      ${data.appointmentType == "revisit" && "bg-sky-600"}
     w-full lg:w-[50%]  mx-auto capitalize text-white p-1 rounded-md`}
        >
          <span className="text-white  rounded-sm">{data.appointmentType}</span>
        </div>

        <div
          onClick={handleDeleteAppointment}
          className="bg-red-700/80 dark:bg-red-700 text-white
   col-span-4 md:col-span-4 lg:col-span-4 flex items-center gap-1
    p-2 rounded-md cursor-pointer clickable w-fit mx-auto
  "
        >
          <span className="font-bold text-xs hidde md:inline-block ">Remove Appointment</span>
          {!deleteAppointmentMutation.isPending ? (
            <Trash size={18} className="text-white ml-auto" />
          ) : (
            <Loader2 
              size={18}
            className="text-white ml-auto animate-spin" />
          )}
        </div>
      </div>
    </>
  )
}

export default AppointmentCard
