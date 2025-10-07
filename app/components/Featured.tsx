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
import { Pagination, Autoplay, A11y, EffectCoverflow} from "swiper/modules"
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
            <div className="featured w-[92%] md:w-[95%] lg:w-[98%] min-h-[20vh] mx-auto my-2 rounded-xl">
              <Swiper
                modules={[Pagination, Autoplay, A11y, EffectCoverflow]}
                effect="coverflow"
                a11y={{ enabled: true }}
                autoplay={{ delay: 5000, disableOnInteraction: true }}
                coverflowEffect={{
                  rotate: -2,
                  stretch: 0,
                  depth: 50,
                  modifier: 1,
                  slideShadows: false,
                }}
                loop={true}
                loopAddBlankSlides={false}
                pagination={{
                  clickable: true,
                  type: "bullets",
                  dynamicBullets:true,
                  dynamicMainBullets:1,

                }}
                observer={true}
                observeParents={true}
                onResize={(swiper) => {
                   swiper.slideTo(0)
                  swiper.update()
                  }}
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
                className="pt-3 w-[100%] md:w-[95%] lg:w-[98%] min-h-[20vh] mx-auto my-2 rounded-xl"
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

                <SwpierControls className="w-full  mt--8 mb-6 flex items-center justify-center gap-6" />
              </Swiper>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Featured
