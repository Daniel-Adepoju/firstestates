import { MoreHorizontal } from "lucide-react"

export const DeleteLoader = () => {
  return <span className="deleteLoader"></span>
}

export const WhiteLoader = () => {
  return <span className="whiteLoader"></span>
}

export const DotsLoader = (className: {className?:string}) => {
  return (
    <div className={`dots-loader `}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export const SkyBlueLoader = () => {
  return(

<div className="w-6 h-6 border-4 my-2
border-r-sky-600
border-b-sky-600
border-l-sky-600
dark:border-r-white
dark:border-b-white
dark:border-l-white
rounded-[50%] 
animate-spin"></div>
  )
}

export function Loader({ className }: { className?: string }) {
  return (
   <div className='mt-50 mx-auto p-4 flex items-center justify-center'>
    <MoreHorizontal
    className="animate-pulse text-darkblue dark:text-coffee"
    size={50}/>
     </div>
  )
}
