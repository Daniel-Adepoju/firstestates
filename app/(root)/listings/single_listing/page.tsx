"use client"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import { useState } from "react"
import Image from "next/image"
import Button from "@lib/Button"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperControls from "@utils/SwpierControls"
import { Pagination, Autoplay, A11y, EffectCoverflow } from "swiper/modules"
import { CldImage } from "next-cloudinary"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "@components/ui/skeleton"
import { useGetSingleListing } from "@lib/customApi"
import { useDarkMode } from "@lib/DarkModeProvider"
import { MapPin, Toilet, Bed, Bath,Phone} from "lucide-react"

const SingleListing = () => {
  const [isSwiperLoaded, setIsSwiperLoaded] = useState(false)
  const listingId = useSearchParams().get("id")
  const {darkMode} = useDarkMode()

  const { data, isLoading, isError } = useGetSingleListing(listingId)

  const handlePhoneClick = () => {
    window.open(`tel:${data?.agent.phone}`)
  }
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${data?.agent.whatsapp}`)
  }
  const openInGoogleMap = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  if (isLoading) {
    return (
      <div className= "pb-6 gap-[30px] flex flex-col  items-center w-full min-h-screen">
        <Skeleton className="bg-gray-200 w-full h-[300px] rounded-4xl" />
        <Skeleton className="bg-gray-200 w-[90%] h-[100px] rounded-xl" />
        <Skeleton className=" bg-gray-200 w-[80%] h-[190px] rounded-xl" />
      </div>
    )
  }
  if (isError) {
    return (
      <div
        className="flex flex-col
      items-center
      justify-center
      text-red-600
      text-xl
      w-full  min-h-screen
       bg-black"
      >
    An error occured due to issues with your network or because the page no longer exists
      </div>
    )
  }
  return (
    <div className="singleCardCon">
      <div className="singleCardSection">
        <div className="single_card">
          <div className="header">
            <div className="house">
              <Swiper
                className="house"
                modules={[Pagination, Autoplay, A11y, EffectCoverflow]}
                a11y={{ enabled: true }}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                navigation
                onSwiper={() => setIsSwiperLoaded(true)}
                pagination={{ clickable: true, type: "bullets" }}
              >
                {data?.gallery.map((image: string) => {
                  return (
                    <SwiperSlide
                      key={image}
                      className={`item ${isSwiperLoaded === false && "itemHide"}`}
                    >
                      <CldImage
                        alt="gallery picture"
                        src={image}
                        fill={true}
                        priority={true}
                      />
                    </SwiperSlide>
                  )
                })}

                <SwiperControls />
                <div id="dot">...</div>
              </Swiper>
            </div>
            <div className="heading location">{data?.location}</div>
            <div className="address">
                 <MapPin
                    size={30}
                     color={darkMode ? "#A88F6E" : "#0881A3"}
                            />
              <span>{data?.address}</span>
            </div>
          </div>

          <div className="body">
            <div className="home_details">
              <div>
                <Bed
                  size={30}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
                <span>{data?.bedrooms} bedrooms</span>
              </div>
              <div>
                <Bath
                  size={30}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
                <span>{data?.bathrooms} bathrooms</span>
              </div>
              <div>
               <Toilet
                  size={30}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
                <span>{data?.toilets} toilets</span>
              </div>
            </div>
          </div>
          <Button
            functions={() => openInGoogleMap(data?.address)}
            className="clickable directional darkblueBtn openMap"
          >
            <Image
              width={30}
              height={30}
              alt="mapBtn"
              src={"/icons/map.svg"}
            />
            <span>Open In Map</span>
          </Button>
        </div>
      </div>

      <div className="singleCardSection">
        <div className="single_card">
          <div className="price">
            <span className="currency">&#8358;</span>
            {data?.price.toLocaleString()}/Year
          </div>
    <div className="school capitalize text-xl">
            {data?.school}
          </div>
          <div className="agent">
            <CldImage
              width={20}
              height={20}
              alt="agent pic"
              src={data?.agent.profilePic}
            />
            <div>
              Listed by <span className="agentCardName">{data?.agent.username}</span>
            </div>
          </div>
        </div>

        {/* agents details */}
        <div className="single_card agent_details">
          <div className="txt heading">Agent&apos;s Details</div>
          <div className="details">
            <div className="subheading">Office Address</div>
            <div className="address">
                <MapPin
                  size={30}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
              <span>{data?.agent.address}</span>
            </div>
            <div className="subheading">Contacts</div>
            <div className="contact_items">
              <div
              className='hover:scale-95 transition-transform duration-200'
              onClick={handlePhoneClick}
                >
                    <Phone
                  size={40}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
                </div>
              <span> {data?.agent.phone}</span>
            </div>
            <div className="contact_items">
              <div
                className='hover:scale-95 transition-transform duration-200'
                onClick={handleWhatsAppClick}
              >
        <Image
              width={50}
              height={50}
              alt="agent pic"
              src={darkMode ? '/icons/whatsAppDark.svg' : '/icons/whatsApp.svg'}
            />
                </div>
              <span>{data?.agent.whatsapp}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleListing
