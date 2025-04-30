'use client'
import { useState } from "react"
import Image from "next/image"
import Main from '@components/Main'
import Button from "@lib/Button";
import { Swiper, SwiperSlide} from 'swiper/react';
import SwiperControls from '@utils/SwpierControls'
import { Pagination, Autoplay, A11y, EffectCoverflow } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const SingleListing = () => {
   const [address, setAddress] = useState(`15, lorem ipsum dolor sit amet, consectetur adipiscing`)
   const [isSwiperLoaded, setIsSwiperLoaded] = useState(false)
   const [phone,setPhone] = useState('07063939389')
  const [whatsApp, setWhatsApp] = useState('07063939389')
   
  const handlePhoneClick = () => {
     window.open(`tel:${phone}`)
   }

   const handleWhatsAppClick = () => {
     window.open(`https://wa.me/${whatsApp}`)
   }
   const openInGoogleMap = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }
   return (

  <div className="singleCardCon">

 <div className="singleCardSection">
 <div className="single_card">
     <div className="header">
      <div className="house">

      <Swiper
      className="house"
 modules={[Pagination,Autoplay, A11y,EffectCoverflow]}
 a11y={{enabled: true}}
 spaceBetween={0}
 slidesPerView={1}
 loop={true}
 autoplay={{delay: 5000, disableOnInteraction:false}}
 navigation
 onSwiper={() => setIsSwiperLoaded(true)}
 pagination={{clickable:true,type: "bullets"}}
 >

  
      <SwiperSlide className={`item ${isSwiperLoaded === false && 'itemHide'}`}>
     <Image 
    alt='gallery picture'
    src='/images/house1.jpg'
  fill={true}
    priority={true}
    />
  </SwiperSlide>
   
  <SwiperSlide className={`item ${isSwiperLoaded === false && 'itemHide'}`}>
     <Image 
    alt='gallery picture'
    src='/images/house1.jpg'
  fill={true}
    />
  </SwiperSlide>

  <SwiperSlide className={`item ${isSwiperLoaded === false && 'itemHide'}`}>
     <Image 
    alt='gallery picture'
    src='/images/house2.jpg'
  fill={true}
    />
  </SwiperSlide>

  <SwiperSlide className={`item ${isSwiperLoaded === false && 'itemHide'}`}>
     <Image 
    alt='gallery picture'
    src='/images/house1.jpg'
  fill={true}    />
  </SwiperSlide>
  
<SwiperControls />
 <div id="dot">...</div>
    </Swiper>
        </div>
         <div className="heading location">
          Town
          </div>
        <div className="address">
        <Image 
        height={30}
        width={30}
        alt="gps_icon"
        src='/icons/location.svg'
        />  
        <span>{address}</span>
          </div>
   </div>
      
         <div className="body">
                <div className="home_details">
                  <div>
                <Image width={30} height={24} alt='icon'src='/icons/bed.png'/>
                    <span>2 bedrooms</span>
                  </div>
                  <div>
                  <Image width={30} height={24} alt='icon' src='/icons/bath.png'/>
                   <span>2 bathrooms</span>
                  </div>
                  <div>
                  <Image width={30} height={24} alt='icon' src='/icons/toilet.png'/>
                  <span>2 toilets</span>  
                  </div>
                  
                </div>   
        </div>
        <Button
  functions={() => openInGoogleMap(address)}
  className="clickable directional darkblueBtn openMap">
    <Image width={30} height={30} alt="mapBtn"
    src={'/icons/map.svg'} />
    <span>Open In Map</span>
  </Button>    
  </div>
  </div>
    
    <div className="singleCardSection">

    
 <div className="single_card">
 <div className="price">
      <span className="currency">&#8358;</span>
      200k/Year
      </div>
     <div className="agent">
                  <Image
                    width={20}
                    height={20}
                    alt='agent pic'
                    src="/images/agent.jpg"
                  />
<div> Listed by <span>John Doe</span></div>
                
    </div>        
   
 </div>
 
 <div className="single_card agent_details">
    <div className="txt heading">
      Agent's Details
    </div>
    <div className="details">
    <div className="subheading">
     Office Address
    </div>
    <div className="address">
    <Image 
        height={30}
        width={30}
        alt="gps_icon"
        src='/icons/location.svg'
        />  
     <span>
     60, lorem ipsum dolor
      </span> 
      </div>
      <div className="subheading">
        Contacts
      </div>
      <div className="contact_items">
       <Image
       onClick={handlePhoneClick}
       width={30} height={30} 
       alt='icon' src='/icons/phone.svg'/>
        <span> {phone}</span>
        </div>
      <div className="contact_items">
        <Image
        onClick={handleWhatsAppClick}
        width={45} height={45} alt='icon' src='/icons/whatsapp.svg'/>
        <span>{whatsApp}</span>
        </div>
    
    </div>
 </div>

 
    </div>
      </div>


  )
}

export default SingleListing