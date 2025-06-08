export const DeleteLoader = () => {
  return <span className="deleteLoader"></span>
}

export const WhiteLoader = () => {
  return <span className="whiteLoader"></span>
}

export const DotsLoader = () => {
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
  return <div className={`loader ${className}`}> </div>
}
