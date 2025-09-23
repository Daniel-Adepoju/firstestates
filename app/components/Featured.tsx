import { useRef, useEffect } from "react"
import { ArrowBigLeft, ArrowBigRight, ChevronRightCircle, Star } from "lucide-react"
import FeaturedCard from "./FeaturedCard"
import { useGetFeaturedListings } from "@lib/customApi"
import { Skeleton } from "./ui/skeleton"
import { CardProps } from "./Card"
import { FeaturedModal } from "./Modals"
import { useUser } from "@utils/user"
import { getDate, createdAt } from "@utils/date"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, A11y, EffectCoverflow, EffectFade } from "swiper/modules"
import SwpierControls from "@utils/SwpierControls"

export const FeaturedBtn = ({
  listingId,
  isFeatured,
  createdDate,
}: {
  listingId?: string
  isFeatured?: boolean
  createdDate: any
}) => {
  const ref = useRef<HTMLDialogElement>(null)
  const { session } = useUser()
  const email = session?.user.email
  const userId = session?.user.id

  const subDate = createdAt(createdDate, true)
  const showModal = () => {
    ref.current?.showModal()
  }

  return (
    <>
      {!isFeatured && Number(subDate) < 30 && (
        <>
          <div
            onClick={showModal}
            className="dark:bg-black/20 bg-white/80 w-10 h-10 
          flex flex-row items-center justify-center
          rounded-full shadow-md
          mediumScale cursor-pointer"
          >
            <Star
              size={30}
              color="#daa520"
            />
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
  )
}

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
        <h1 className="subheading flex items-center gap-1 ml-4 mb-2 text-center">
          Featured
          <ChevronRightCircle className="relative w-6 h-6" />
        </h1>

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
          <h1 className="subheading flex items-center gap-1 ml-4  text-center">
            Featured
            <ChevronRightCircle className="relative w-6 h-6" />
          </h1>

          {!isLoading && (
            <>
              <Swiper
                modules={[Pagination, Autoplay, A11y, EffectCoverflow, EffectFade]}
                // effect="coverflow"
                a11y={{ enabled: true }}
                autoplay={{ delay: 4000, disableOnInteraction: true }}
                // coverflowEffect={{
                //   rotate: 0,
                //   stretch: 0,
                //   depth: 0,

                //   modifier: 0,
                //   slideShadows: false,
                // }}
                loop
                pagination={{
                  clickable: true,
                  type: "bullets",
                }}
                observer={true}
                observeParents={true}
                onResize={(swiper) => swiper.slideTo(0)}
                slidesPerView={1}
                slidesPerGroup={1}
                slidesPerGroupSkip={1}
                spaceBetween={0}
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 20, slidesPerGroup: 1 },
                  768: { slidesPerView: 2, spaceBetween: 40, slidesPerGroup: 2 },
                  1054: { slidesPerView: 3, spaceBetween: 50, slidesPerGroup: 3 },
                }}
                onBreakpoint={(swiper) => {
                  swiper.update()
                }}
                className="pt-4  w-[90%] md:w-[95%] lg:w-[98%] min-h-[20vh] my-2 rounded-xl featured"
              >
                {data?.featuredListings.map((featured: CardProps["listing"]) => (
                  <SwiperSlide
                    key={featured._id}
                    className="featured_container"
                  >
                    <FeaturedCard
                      key={featured._id}
                      listing={featured}
                    />
                  </SwiperSlide>
                ))}

                <SwpierControls className="w-full  mt--4 mb-4 flex items-center justify-center gap-2" />
              </Swiper>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Featured
