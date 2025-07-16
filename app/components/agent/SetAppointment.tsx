import { Calendar } from "@components/ui/calendar"

import { useState, useEffect } from "react"


type SetAppointmentProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

const SetAppointment = ({ date, setDate }: SetAppointmentProps) => {
      const [mounted, setMounted] = useState(false)

useEffect(() => {
    setMounted(true)
    setDate(new Date())
  }, [])

    if(!mounted) return null

  return (
     <div className="flex flex-col gap-3">
            <h2 className="otherHead text-md font-bold self-center"> Set date for a viewing </h2>

            <div className="flex flex-col lg:flex-row  gap-4 ">
              <Calendar 
    mode="single"
    defaultMonth={date}
    selected={date}
    onSelect={setDate}
    captionLayout="dropdown"
    className="dark:text-white dark:bg-darkGray bg-white shadow-md "
    classNames={{
    day: "rounded-md p-0 md:p-2 mx-[2px] my-[2px] hover:border-0.5 border-gray-500/40",
  }}/>
    
            </div>
          </div>
  )
}

export default SetAppointment