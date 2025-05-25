'use client'
import Card from "@components/Card"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {CardProps} from "@components/Card"
import { useGetAgentListings } from "@lib/customApi"
import { useUser } from "@utils/user"
import { Loader } from "@utils/loaders"
const Listings = () => {
  const [selected, setSelected] = useState('view') 
  const {session} = useUser()
  const [agentId,setAgentId] = useState("")
 const [spiningNum,setSpiningNum] = useState(0)

  useEffect(() => {
    if (session?.user.id && !agentId) {
      setAgentId(session.user.id)
    }
  }, [session, agentId])

 useEffect(() => {
  const intervalId = setInterval(() => {
    setSpiningNum((prev) => {
    if(prev === 10) setSpiningNum(0)
      return prev + 1
    })
  },100)
  return () => clearInterval(intervalId)

},[spiningNum])
  

const { data,isLoading } = useGetAgentListings(agentId, {
  enabled: !!agentId
})
  
   const mapCards = data?.listings?.map((item:CardProps['listing']) => {
  return <Card key={item._id} listing={item} edit={selected === 'edit' && true} />
  })


  return (
    <>
    <div className="listingHistory">
       <div>
      <span>Renting</span>
       <strong className="currency">
    {isLoading || !session ? spiningNum : 2}
       </strong>
       <span>
      {data?.listings.length > 1 ? "properties" : "property"}
        </span>   
       </div>
     
     <div>
   <span> Currently Listing</span>
    <strong className="currency">
   {isLoading || !session ? spiningNum : data?.listings.length}
      </strong>
   <span>{data?.listings.length > 1 ? "properties" : "property"}</span>
  </ div>
   
    </div>
    
      <div className="addListing">
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
    </>
  )
}

export default Listings