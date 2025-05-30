'use client'
import Card from "@components/Card"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {CardProps} from "@components/Card"
import { useGetAgentListings } from "@lib/customApi"
import { useUser } from "@utils/user"
import { Loader, SkyBlueLoader} from "@utils/loaders"
import {useSearchParams} from "next/navigation"
import Pagination from "@components/Pagination"

const Listings = () => {
  const limit = 10
  const page = useSearchParams().get('page') || '1'
  const [selected, setSelected] = useState('view') 
  const {session} = useUser()
  const [agentId,setAgentId] = useState("")

  useEffect(() => {
    if (session?.user.id && !agentId) {
      setAgentId(session.user.id)
    }
  }, [session, agentId])


const { data,isLoading } = useGetAgentListings({
  id: agentId,
  enabled: !!agentId,
  page,
  limit
})
  
   const mapCards = data?.listings?.map((item:CardProps['listing']) => {
  return <Card key={item._id} listing={item} edit={selected === 'edit' && true} />
  })


  return (
    <>
    <div className="listingHistory">
       <div className="item">
      <span>Renting</span>
      
       <strong className="currency">
    {isLoading || !session ? <SkyBlueLoader /> : data?.currentRentings}
       </strong>
       <span>
      {data?.currentRentings > 1 ? "properties" : "property"}
        </span>   
       </div>
     
     <div className="item">
   <span>Listing</span>
    <strong className="currency">
   {isLoading || !session ? <SkyBlueLoader /> : data?.currentListings}
      </strong>
   <span>{data?.currentListings > 1 ? "properties" : "property"}</span>
  </ div>
   
    </div>
    
      <div className="addListing dark:text-white">
      <Link href={'/agent/listings/add'}>
     <Image className="clickable" src={'/icons/add.svg'} width={50} height={50} alt="add"/>
      </Link>
        <span>Add New Listing</span>
      </div>
     
      {/* </div> */}
    <div className="availableLists">
      <div className="header">
  <div onClick={() => setSelected('view')} className={`${selected === 'view' && 'active'} subheading`}>View Listings</div>
  <div onClick={() => setSelected('edit')} className={`${selected === 'edit' && 'active'} subheading`}>Edit Listings</div> 
      </div>
  {!session || isLoading ? <Loader className="my-20" /> : mapCards }
    </div>
     <Pagination
   currentPage={Number(data?.cursor)}
   totalPages={Number(data?.numOfPages)}/>
    </>
  )
}

export default Listings