import { useRef, useEffect } from "react"
import { ChevronRightCircle, Star } from "lucide-react"
import FeaturedCard from "./FeaturedCard"
import { useGetFeaturedListings } from "@lib/customApi"
import { Skeleton } from "../ui/skeleton"
import { CardProps } from "./Card"
import { FeaturedModal } from "../Modals"
import { useUser } from "@utils/user"
import { getDate, createdAt } from "@utils/date"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, A11y, EffectCoverflow } from "swiper/modules"
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
            className="dark:bg-darkGray/20 bg-white/80 w-10 h-10 
          flex flex-row items-center justify-center
          rounded-full shadow-md dark:shadow-black/30
          gloss hover:scale-99 ease-out duration-100 transition-transform cursor-pointer"
          >
            <Star
              size={30}
              className="text-yellow-500"
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
        <div className="mx-auto flex w-[94%] items-end gap-3 border-b border-slate-200 pb-3 dark:border-white/10">
          <Star className="h-6 w-6 text-goldPrimary" />
          <div>
           
            <span className="subheading">Featured homes</span>
          </div>
        </div>

        <div className="featured dark-to-lightblue-gradient mx-auto my-4 min-h-[20vh] w-[94%] rounded-[1.75rem] p-2 pb-0 shadow-xl shadow-blue-950/20">
          <div className="featured_container mx-auto grid w-full grid-flow-col auto-cols-[minmax(18rem,1fr)] gap-3 overflow-hidden rounded-xl p-3 md:auto-cols-[minmax(22rem,1fr)]">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-60 w-full rounded-xl bg-white/15 shadow-md"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {data?.featuredListings.length > 0 && (
        <>
          <div className="mx-auto flex w-[94%] items-end gap-3 border-b border-slate-200 pb-3 dark:border-white/10">
            <Star className="h-6 w-6 text-goldPrimary" />
            <div>
             
              <span className="subheading">Featured homes</span>
            </div>
          </div>

          {!isLoading && (
            <div className="featured dark-to-lightblue-gradient mx-auto my-4 min-h-[20vh] w-[94%] rounded-[1.75rem] p-2 pb-0 shadow-xl shadow-blue-950/20">
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
                  dynamicBullets: true,
                  dynamicMainBullets: 1,
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
                    className="featured_container mb-4"
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
