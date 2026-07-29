import { MoreHorizontal, HomeIcon, Loader2 } from "lucide-react"

const LoadingBoard = ({ type = "normal", text }: any) => {
  return (
    <div className="w-full h-90  flex flex-col justify-center items-center font-head font-bold">
      {type === "listing" && (
        <div className="flex flex-col items-center justify-center gap-1">
          <HomeIcon
            size={70}
            strokeWidth={1}
            className="text-foreground"
          />
          <div className="mt-2 text-xl text-center text-foreground tracking-wide font-card">
            {text}
          </div>
          <Loader2 className="text-gray-500 dark:text-gray-300  animate-spin" />
        </div>
      )}

      {type === "normal " && (
        <div className="flex items-center justify-center gap-1">
          <div className="mt-4 text-xl text-center text-foreground">{text}</div>
          <MoreHorizontal className="self-end text-foreground text-4xl animate-pulse" />
        </div>
      )}
    </div>
  )
}

export default LoadingBoard
