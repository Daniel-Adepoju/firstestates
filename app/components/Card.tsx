"use client"
import React, { useRef, useState } from "react"
import { CldImage } from "next-cloudinary"
import { truncateAddress } from "@utils/truncateAddress"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import DeleteModal from "./DeleteModal"
import { DeleteLoader } from '@utils/loaders';

interface Agent {
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
}

export interface CardProps {
 edit: boolean,
 listing: Listing,
}
const Card = ({ edit, listing}: CardProps) => {
  const [address, setAddress] = useState(listing?.address || "Lagos, Nigeria")
  const router = useRouter()
  const deleteRef = useRef<HTMLDialogElement>(null)
  const [deleting,setDeleting] = useState(false)
  const openDialog = () => {
    deleteRef.current?.showModal()
  }
  return (
    <>
      <div className="cardContainer">
        <div className="card">
          <Link className='no-underline' href={`/listings/single_listing?id=${listing?._id}`}>
             <div className="houseImg">
            <CldImage
              fill={true}
              alt="post_img"
              src={listing?.mainImage}
              crop={{
                type: "auto",
                source: true,
              }}
            />
          </div>

          <div className="body">
            <div className="location heading">{listing?.location}</div>
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
                    <span>{listing?.bedrooms} bedrooms</span>
                  </div>
                  <div>
                    <Image
                      width={30}
                      height={24}
                      alt="icon"
                      src="/icons/bath.png"
                    />
                    <span>{listing?.bathrooms} bathrooms</span>
                  </div>
                  <div>
                    <Image
                      width={30}
                      height={24}
                      alt="icon"
                      src="/icons/toilet.png"
                    />
                    <span>{listing?.toilets} toilets</span>
                  </div>
                </div>
           <div className="school">{listing?.school}</div>
                <div className="agent">
                  <CldImage
                    width={20}
                    height={20}
                    alt="agent pic"
                    src={listing?.agent.profilePic}
                  />
                  <div>
              Listed by <span>{listing?.agent.username}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          </Link>
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
