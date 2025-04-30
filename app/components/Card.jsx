"use client"
import React, { useState } from "react"
import { CldImage } from "next-cloudinary"
import Image from "next/image"
import Button from "@lib/Button"
import { truncateAddress } from "@utils/truncateAddress"
import { useRouter } from "next/navigation"
const Card = ({ edit }) => {
  const [address, setAddress] = useState(
    `23, lorem ipsum dolor sit amet, consectetur adipiscing elit`
  )
  const router = useRouter()

  const viewDetails = () => {
    router.push("/listings/single_listing")
  }

  const img1 = "z989yqaqht7f9yggcxii"
  const img2 = "brrajesvatevpbrnoi99"
  return (
    <>
      <div className="cardContainer">
         
        <div className="card">
          <div className="houseImg">
            <CldImage
              fill={true}
              alt="post_img"
              src={img2}
              crop={{
                type: "auto",
                source: true,
              }}
            />
          </div>

          <div className="body">
            <div className="location heading">Town</div>
            <div className="address">
              <Image
                width={20}
                height={20}
                alt="gps_icon"
                src="/icons/location.svg"
              />
              <span>{truncateAddress(address, 30)}</span>
            </div>
            {!edit && (
              <>
                <div className="home_details">
                  <div>
                    <Image
                      width={30}
                      height={24}
                      alt="icon"
                      src="/icons/bed.png"
                    />
                    <span>2 bedrooms</span>
                  </div>
                  <div>
                    <Image
                      width={30}
                      height={24}
                      alt="icon"
                      src="/icons/bath.png"
                    />
                    <span>2 bathrooms</span>
                  </div>
                  <div>
                    <Image
                      width={30}
                      height={24}
                      alt="icon"
                      src="/icons/toilet.png"
                    />
                    <span>2 toilets</span>
                  </div>
                </div>

                <div className="agent">
                  <Image
                    width={20}
                    height={20}
                    alt="agent pic"
                    src="/images/agent.jpg"
                  />
                  <div>
                    Listed by <span>John Doe</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {!edit && <div className="price">&#8358;200k/year</div>}
        </div>
        <div className="bottom-line">
        </div>
    
        {edit && (
          <div className="editSide">
            <Image
              src="/icons/edit.svg"
              width={40}
              height={40}
              alt="edit"
            />
            <Image
              src="/icons/archive.svg"
              width={40}
              height={40}
              alt="archive"
            />
            <Image
              src="/icons/delete.svg"
              width={40}
              height={40}
              alt="delete"
            />
          </div>
        )}
      
      </div>

    </>
  )
}
export default Card
