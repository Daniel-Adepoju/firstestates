import { MoreHorizontal } from "lucide-react"

const LoadingBoard = ({ text }: any) => {
  return (
    <div className="w-full h-90 flex flex-col justify-center items-center font-head font-bold">
      <div className="flex items-center justify-center gap-1">
        <div className="mt-4 text-xl text-center text-foreground">{text}</div>
        <MoreHorizontal className="self-end text-foreground text-4xl animate-pulse" />
      </div>
    </div>
  )
}

export default LoadingBoard
