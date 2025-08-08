import { axiosdata } from "@utils/axiosUrl";
import { parseDate } from "@utils/date";
import { Loader2, Trash } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import Toast from "@components/Toast";
import { useState } from "react";

interface AppointmentCardProps {
    firstCard: number;
    data: any;
}

const AppointmentCard = ({firstCard,data}:AppointmentCardProps) => {
  const queryClient = useQueryClient()
  const [notification,setNotification] = useState({
     isActive:false,
    message:'',
    status:''
  })



  const deleteFn = async (val: {appointmentId:string}) => {
    try {
    await axiosdata.value.delete('/api/listings/appointment',{
      data:val
    })
      setNotification({
      isActive:true,
      message:'Appointment Deleted',
      status:'success'
    })
  } catch (err) {
      setNotification({
      isActive:true,
      message:'Failed to delete appointment, try again',
      status:'danger'
    })
  }
  }

  const deleteAppointmentMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['appointments']})
    }
  })

  const handleDeleteAppointment = () => {
    deleteAppointmentMutation.mutate({appointmentId:data._id})
  }


  return (
    <>
    <Toast
    isActive={notification.isActive}
    setIsActive={setNotification}
    message={notification.message}
    status={notification.status}
    />
   
     <div 
    className={`${firstCard === 0 && 'mt-5'} appointment_item dark:text-white
    grid grid-cols-4 items-center  p-2 self-start w-full gap-2 shadow-sm text-center break-words
    `}>
        <div>

       <Link
        href={`/listings/single_listing?id=${data.listingID._id}`} 
        target="_blank"
        className="mx-auto block">
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
      <div className={`
      ${data.appointmentType === 'final' && 'bg-slate-600'}
       ${data.appointmentType === 'initial' && 'bg-green-600'}
      ${data.appointmentType === 'revisit' && 'bg-sky-600'}
     w-full lg:w-[50%]  mx-auto capitalize text-white p-1 rounded-md`}>
        <span 
        className='text-white  rounded-sm'>
        {data.appointmentType}
          </span>
          </div>

  <div
 onClick={handleDeleteAppointment}  
  className="bg-red-700/80 dark:bg-red-700 text-white 
   col-span-3 md:col-span-2 lg:col-span-1 flex items-center justify-between gap-1
    p-2 rounded-md cursor-pointer clickable
  ">
<span className="font-bold">Remove Appointment</span>
 {!deleteAppointmentMutation.isPending ? <Trash 
className="text-white"
/>
: <Loader2 
className="text-white animate-spin"/>
 }
 </div>
  </div>
  </>
  )
}

export default AppointmentCard