"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, A11y, EffectCoverflow } from "swiper/modules"
import { CldImage, CldVideoPlayer } from "next-cloudinary"
import SwiperControls from "@utils/SwpierControls"
import { MapPin, Bed, Bath, Toilet, PlaySquare, Images } from "lucide-react"
import { useState } from "react"

interface Props {
  listing: any
}

const ListingHeader = ({ listing }: Props) => {
  const [isSwiperLoaded, setIsSwiperLoaded] = useState(false)
  const [headerTab, setHeaderTab] = useState("gallery")

  return (
    <>
      <div className="header">
        {/* Media actions: keep gallery and video as clear, separate choices. */}
        {listing.video && (
          <div className="mx-2 mb-3 mt-2 flex w-[calc(100%-1rem)] flex-row gap-2 rounded-2xl border border-border/60 bg-background/80 p-1.5 shadow-sm backdrop-blur sm:w-fit">
            <button
              type="button"
              aria-pressed={headerTab === "gallery"}
              onClick={() => setHeaderTab("gallery")}
              className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:min-w-36 ${headerTab === "gallery" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Images size={18} aria-hidden="true" />
              <span>Gallery</span>
            </button>
            <button
              type="button"
              aria-pressed={headerTab === "video"}
              onClick={() => setHeaderTab("video")}
              className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:min-w-36 ${headerTab === "video" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
            >
              <PlaySquare size={18} aria-hidden="true" />
              <span>Video tour</span>
            </button>
          </div>
        )}
        {/* main gallery header */}
        <div className="house listing-gallery">
          {headerTab === "gallery" && (
            <Swiper
              className="house"
              modules={[Pagination, Autoplay, A11y, EffectCoverflow]}
              spaceBetween={0}
              slidesPerView={1}
              loop
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true, type: "bullets" }}
              onSwiper={() => setIsSwiperLoaded(true)}
            >
              {listing?.gallery?.map((image: string, index: number) => (
                <SwiperSlide
                  key={`${image}-${index}`}
                  className={`item !h-full !w-full !pt-0 ${!isSwiperLoaded && "itemHide"}`}
                >
                  <CldImage
                    alt="gallery picture"
                    className="h-full w-full object-cover object-center"
                    src={image}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                    quality="auto:best"
                    format="auto"
                    dpr="auto"
                    priority={index === 0}
                  />
                </SwiperSlide>
              ))}

              <SwiperControls />
            </Swiper>
          )}
          {headerTab === "video" && (
            <CldVideoPlayer
              src={listing.video}
              width="1920"
              height="1080"
              controls
              logo={false}
              colors={{
                accent: "#032679",
                base: "#000000",
                text: "#F29829",
              }}
              className="mt-4 rounded-md"
            />
          )}
        </div>

        <div className="heading location">{listing?.location}</div>

        <div className="flex items-center gap-1">
          <MapPin
            size={25}
            className="text-goldPrimary"
          />
          <span className="text-sm text-medium text-gray-600 dark:text-gray-300">
            {listing?.address}
          </span>
        </div>
      </div>

      <div className="body">
        <div className="home_details mx-auto justify-center font-medium text-sm">
          <div>
            <Bed
              size={26}
              className="text-goldPrimary"
            />
            <span>
              {listing?.bedrooms} {Number(listing?.bedrooms) === 1 ? "bedroom" : "bedrooms"}
            </span>
          </div>
          <div>
            <Bath
              size={26}
              className="text-goldPrimary"
            />
            <span>
              {listing?.bathrooms} {Number(listing?.bathrooms) === 1 ? "bathroom" : "bathrooms"}
            </span>
          </div>
          <div>
            <Toilet
              size={26}
              className="text-goldPrimary"
            />
            <span>
              {listing?.toilets} {Number(listing?.toilets) === 1 ? "toilet" : "toilets"}
            </span>
          </div>
        </div>
      </div>

    </>
  )
}

export default ListingHeader
