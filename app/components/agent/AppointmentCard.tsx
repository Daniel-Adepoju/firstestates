import { parseDate } from "@utils/date";
import { CldImage } from "next-cloudinary";
import Link from "next/link";


interface AppointmentCardProps {
    firstCard: number;
    data: any;
}

const AppointmentCard = ({firstCard,data}:AppointmentCardProps) => {
  return (
     <div 
    className={`${firstCard === 0 && 'mt-5'} appointment_item dark:text-white
    grid grid-cols-4 items-center  p-2 self-start w-full gap-2 shadow-sm text-center break-words
    `}>
        <div>

       {/* <Link href="/" className="mx-auto block"> */}
    <CldImage 
      src={data.listingID.mainImage}
      width={100}
      height={100}
      crop={"fit"}
      gravity="center"
      alt="house"
      className="rounded-md mx-auto"
    /> 
    {/* </Link> */}
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

  </div>
  )
}

export default AppointmentCard