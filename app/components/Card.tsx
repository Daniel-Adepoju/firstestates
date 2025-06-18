"use client"
import React, { useRef, useState } from "react"
import { CldImage } from "next-cloudinary"
import { truncateAddress } from "@utils/truncateAddress"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {DeleteModal} from "./Modals"
import { DeleteLoader } from '@utils/loaders';
import { useDarkMode } from "@lib/DarkModeProvider"
import {Toilet, Bed, Bath, MapPin, Eye} from "lucide-react"
import { formatNumber } from "@utils/formatNumber"

interface Agent {
  _id: string;
  profilePic: string;
  username: string;
}
export interface Listing {
  _id?: string;
  address: string;
  location: string;
  image?: string;
  price?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  agent: Agent;
  mainImage: string;
  gallery?: string[];
  createdAt?: string;
  status?: string;
  school?:string;
  weeklyViews?: number;
  totalViews?: number;
}

export interface CardProps {
 edit: boolean,
 isAgentCard?: boolean,
 listing: Listing,
}
const Card = ({ edit,listing,isAgentCard}: CardProps) => {
  const [address, setAddress] = useState(listing?.address || "Nigeria")
  const router = useRouter()
  const deleteRef = useRef<HTMLDialogElement>(null)
  const [deleting,setDeleting] = useState(false)
  const {darkMode} = useDarkMode()
  const [weeklyViews] = useState(formatNumber(listing?.weeklyViews ?? 0) || 0)
  const [totalViews] = useState(formatNumber(listing?.totalViews ?? 0) || 0)
  const openDialog = () => {
    deleteRef.current?.showModal()
  }

  const visitCard = () => {
    router.push(`/listings/single_listing?id=${listing?._id}`)
  }
  return (
    <>
      <div className="cardContainer">
        <div onClick={visitCard} className="card">
          {/* <div className='no-underline'> */}
             <div className="houseImg">
            {listing?.mainImage?.startsWith("http") ? (
  <img
    src='/images/house3.jpg'
    alt="post_img"
    className="object-contain mt-[-60%] w-full rounded-t-lg"
  />
) : (
  <CldImage
    fill={true}
    alt="post_img"
    src={listing.mainImage}
    crop={{
      type: "auto",
      source: true,
    }}
  />
)}

          </div>

          <div className="body">
            <div className="location heading">{listing?.location}</div>
            <div className="address">
            <MapPin 
            size={24}
            color={darkMode ? "#A88F6E" : "#0881A3"}
            />
              <span>{truncateAddress(address, 30)}</span>
            </div>
            {!edit && (
              <>
                <div className="home_details">
                  <div>
                        <Bed
                  size={30}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
                    <span>{listing?.bedrooms}</span>
                  </div>
                  <div>
                      <Bath
                  size={30}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
                    <span>{listing?.bathrooms}</span>
                  </div>
                  <div>
                    <Toilet
                  size={30}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
                    <span>{listing?.toilets}</span>
                  </div>
                </div>
        
           
            {!isAgentCard && <div className="agent">
              
        <div className=" w-full text-sm flex flex-col
        items-center justify-start gap-1
         break-words">
              <div className="z-1000 text-md font-bold text-gray-600 dark:text-white">Listed By</div>
              <Link 
              onClick={(e) => e.stopPropagation()}
              href={`/agent-view/${listing?.agent?._id}`}
              className='block break-all text-start  agentCardName'>
                <CldImage
                    width={20}
                    height={20}
                    alt="agent pic"
                    className="my-1"
                    src={listing?.agent?.profilePic}
                  /> 
                  {listing?.agent?.username}
               </Link>
                  </div>
                </div> }
                      {isAgentCard && (
      <div className="w-full flex flex-col pl-3 font-semibold">
        <div className="flex flex-row gap-3 items-center text-sm">
            <Eye size={30}
                color={darkMode ? "#A88F6E" : "#0881A3"}
            />
             Past Week Views
        <span className="views smallNum ">
          {weeklyViews} 
          </span>
        </div>

        <div className="flex flex-row gap-3 items-center text-sm">
           <Eye size={30} 
           color={darkMode ? "#A88F6E" : "#0881A3"}/>
           Total Views
        <span className="views smallNum">
        {totalViews} 
          </span>
          </div>
      </div>     
     )}
        <div className="school rounded-sm">{listing?.school}</div>
              </>
            )}
          </div>
          {/* </div> */}
       {!edit && <div className={`tag ${listing?.status === 'rented' && "rented"}`}>{listing?.status}</div>}
        
    
        </div>
         
       

        {edit && (
          <div className="editSide">
            <Image
              onClick={() => router.push(`/agent/listings/edit?id=${listing?._id}`)}
              src="/icons/edit.svg"
              width={40}
              height={40}
              alt="edit"
            />
            {/* <Image
              src="/icons/archive.svg"
              width={40}
              height={40}
              alt="archive"
            /> */}
    {deleting ?  <DeleteLoader /> :
           <Image
              src="/icons/delete.svg"
              width={40}
              height={40}
              alt="delete"
              onClick={openDialog}
            />}
       <DeleteModal
       ref={deleteRef}
       setDeleting={setDeleting}
       listingId={listing?._id ?? ""}/>
          </div>
        )}
      
      </div>
    </>
  )
}
export default Card
