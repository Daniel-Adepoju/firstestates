"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, A11y, EffectCoverflow } from "swiper/modules"
import { CldImage } from "next-cloudinary"
import SwiperControls from "@utils/SwpierControls"
import { MapPin, Bed, Bath, Toilet } from "lucide-react"
import { useState } from "react"

interface Props {
  listing: any
}

const ListingHeader = ({ listing }: Props) => {
  const [isSwiperLoaded, setIsSwiperLoaded] = useState(false)

  const openInGoogleMap = (address?: string) => {
    if (!address) return
    const encoded = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, "_blank")
  }

  return (
    <>
      <div className="header">
        <div className="house">
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
            {listing?.gallery?.map((image: string) => (
              <SwiperSlide
                key={image}
                className={`item ${!isSwiperLoaded && "itemHide"}`}
              >
                <CldImage
                  alt="gallery picture"
                  src={image || "firstestatesdefaultuserpicture"}
                  fill
                  preload
                />
              </SwiperSlide>
            ))}
            <SwiperControls />
          </Swiper>
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
        <div className="home_details font-medium">
          <div>
            <Bed
              size={30}
              className="text-goldPrimary"
            />
            <span>{listing?.bedrooms} bedrooms</span>
          </div>
          <div>
            <Bath
              size={30}
              className="text-goldPrimary"
            />
            <span>{listing?.bathrooms} bathrooms</span>
          </div>
          <div>
            <Toilet
              size={30}
              className="text-goldPrimary"
            />
            <span>{listing?.toilets} toilets</span>
          </div>
        </div>
      </div>

      <div
        className="darkblueBtn directional flex items-center justify-center py-6 px-12"
        onClick={() => openInGoogleMap(listing?.address)}
      >
        <Image
          width={25}
          height={25}
          alt="mapBtn"
          src={"/icons/map.svg"}
        />
        <span className="-ml-1 font-semibold text-sm">Open In Map</span>
      </div>
    </>
  )
}

export default ListingHeader
