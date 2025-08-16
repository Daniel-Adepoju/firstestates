import { useRef, useEffect } from "react"
import { ArrowBigLeft, ArrowBigRight,ChevronRightCircle,Star} from "lucide-react"
import FeaturedCard from "./FeaturedCard"
import { useGetFeaturedListings } from "@lib/customApi"
import { Skeleton } from "./ui/skeleton"
import { CardProps } from "./Card"
import { FeaturedModal } from "./Modals"
import { useUser } from "@utils/user"
import { getDate,createdAt} from "@utils/date"

export const FeaturedBtn = ({listingId,isFeatured,createdDate}: {listingId?:string,isFeatured?:boolean,createdDate:any}) => {
  const ref = useRef<HTMLDialogElement>(null)
  const {session} = useUser()
  const email = session?.user.email
  const userId = session?.user.id

 const subDate = createdAt(createdDate,true)
  const showModal = () => {
    ref.current?.showModal()
  }

  return (
    <>
    {!isFeatured && (Number(subDate) < 30) && (
    <>
      <div 
        onClick={showModal}
        className="dark:bg-black/20 bg-white/80 w-10 h-10 
          flex flex-row items-center justify-center
          rounded-full shadow-md
          mediumScale cursor-pointer">
          <Star 
            size={30}
            color='#daa520'/>
      </div>
      <FeaturedModal
        userId={userId}
        listingId={listingId}
        email={email}
        ref={ref}
      />
    </>
  )}
  
  
  </>
  )}

const Featured = () => {
  const { data, isLoading } = useGetFeaturedListings()
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollLock = useRef(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const scrollByCards = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return

    const card = container.querySelector(".card") as HTMLElement | null
    if (!card) return

    const style = getComputedStyle(card)
    const marginLeft = parseFloat(style.marginLeft || "0")
    const marginRight = parseFloat(style.marginRight || "0")
    const totalCardWidth = card.offsetWidth + marginLeft + marginRight

    const visibleCount = Math.floor(container.offsetWidth / totalCardWidth)
    const scrollAmount = totalCardWidth * visibleCount
    if (!container || scrollLock.current) return
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    })
    scrollLock.current = true
    setTimeout(() => {
      scrollLock.current = false
    }, 500)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX

    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const threshold = 50

    if (distance > threshold) {
      // Swiped left
      scrollByCards("right")
    } else if (distance < -threshold) {
      // Swiped right
      scrollByCards("left")
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  if (isLoading) {
    return (
      <div className="w-full my-4">
        <div className="mx-auto featured_container w-90 md:w-181 xl:w-271 grid grid-flow-col auto-cols-auto gap-1 overflow-x-hidden">
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              className="w-90 h-60 animate-none bg-gray-500/20 rounded-xl shadow-md"
            />
          ))}
        </div>
      </div>
    )
  }
  return (
    <>
      {data?.featuredListings.length > 0 && (
        <>
          <h1 className="subheading flex items-center gap-1 ml-4 text-center">
            Featured
            <ChevronRightCircle className="relative w-6 h-6" />
            </h1>
          <div  className="featured pt-4 w-full min-h-[20vh] my-4
                        rounded-3xl flex flex-col items-center justify-center
                    ">
     <div  className="pt-4 w-full min-h-[20vh] my-2
                      flex flex-row items-center justify-center
                    ">

            {/* big screen left arrow */}
            <div
              onClick={() => scrollByCards("left")}
              className="flex-row items-center justify-center hidden lg:flex cursor-pointer smallScale w-15 h-15 p-3 rounded-full shadow-md dark:bg-gray-700  bg-white hover:shadow-lg transition"
            >
              <ArrowBigLeft
                size={30}
                color="#f29829"
                className="text-white"
              />
            </div>

            {!isLoading && (
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                ref={scrollRef}
                className="featured_container w-90 md:w-181 xl:w-271 overflow-x-hidden grid grid-flow-col auto-cols-auto"
              >
                {data?.featuredListings.map((featured: CardProps["listing"]) => (
                  <FeaturedCard
                    key={featured._id}
                    listing={featured}
                  />
                ))}
              </div>
            )}

  {/* big screen right arrow */}
            <div
              onClick={() => scrollByCards("right")}
              className="flex-row items-center justify-center hidden lg:flex cursor-pointer smallScale  w-15 h-15 p-3 rounded-full shadow-md dark:bg-gray-700 bg-white hover:shadow-lg transition"
            >
              <ArrowBigRight
                size={30}
                color="#f29829"
                className="text-white"
              />
            </div>
          </div>

          {/* small screen arrows */}
          <div className="w-full py-2 flex flex-row justify-center gap-15 lg:hidden">
            <div
              onClick={() => scrollByCards("left")}
              className="flex flex-row items-center justify-center cursor-pointer smallScale  w-15 h-15 p-3 rounded-full shadow-md dark:bg-gray-700  bg-white hover:shadow-lg transition"
            >
              <ArrowBigLeft
                size={30}
                color="#f29829"
              />
            </div>
            <div
              onClick={() => scrollByCards("right")}
              className="flex flex-row items-center justify-center cursor-pointer smallScale   w-15 h-15 p-3 rounded-full shadow-md dark:bg-gray-700 bg-white hover:shadow-lg transition"
            >
              <ArrowBigRight
                size={30}
                color="#f29829"
              />
            </div>
          </div>

          </div>
        </>
      )}
    </>
  )
}

export default Featured
