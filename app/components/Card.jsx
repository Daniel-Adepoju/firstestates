'use client'
import React, { useState } from "react"
import Image from "next/image"
import Button from "./Button"
import { truncateAddress } from "../utils/truncateAddress"
const Card = () => {
  const [address, setAddress] = useState(`23 PBO, off Idimu Rd, 14, Adimula Street Calvary`)

    
  return (
    <>
      <div className="card">
        <div className="houseImg">
          <Image
          fill={true}
          priority={true}
          src="/images/house3.jpg"
          alt={"img"}
        />
          </div>

        <div className="body">
    <div className="location heading">Idimu</div>
  <div className="address">
      <Image width={20} height={20}
       alt="gps_icon"
       src='/icons/location.svg' />
       <span>
      {truncateAddress(address,36)}
      </span>
      
            </div>

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
        <div className="price">&#8358;200k/year</div>
      
         <div className="view_property">
            <Button className="directional clickable darkblueBtn">
              View Property
            </Button>
          </div>
      </div>
    </>
  )
}
export default Card
