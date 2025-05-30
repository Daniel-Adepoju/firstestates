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

<div className="w-6 h-6 border-4 border-r-sky-400 my-2 border-b-sky-500 border-l-sky-600 rounded-[50%] animate-spin"></div>

  )
}

export function Loader({ className }: { className?: string }) {
  return <div className={`loader ${className}`}> </div>
}
