'use client'
import Card from "@components/Card"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {CardProps} from "@components/Card"
import { useGetAgentListings } from "@lib/customApi"
import { useUser } from "@utils/user"
import { Loader, SkyBlueLoader} from "@utils/loaders"
import {useSearchParams, useRouter} from "next/navigation"
import Pagination from "@components/Pagination"
import Searchbar from "@components/Searchbar"
import { useSignals, useSignal} from "@preact/signals-react/runtime"
import { useDarkMode } from "@lib/DarkModeProvider"
import Payments from "@components/Payments"
import { useGetAgentPayments } from '@lib/customApi';

const Listings = () => {
  useSignals()
  const {session} = useUser()
  const userId = session?.user.email
  const {darkMode} = useDarkMode()
  const params = useSearchParams()
  const limit = 10
  const page = params.get('page') || '1'
  const [selected, setSelected] = useState('view') 
  const [agentId,setAgentId] = useState("")
  const search = useSignal("")
  const debounced = useSignal("")
  const searchParams = new URLSearchParams(params.toString())
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    if (session?.user.id && !agentId) {
      setAgentId(session.user.id)
    }
    setShowAdd(true)
  }, [session, agentId])


useEffect(() => {
    const timeoutId= setTimeout(() => {
       searchParams.set('page', '1')
       router.push(`?${searchParams.toString()}`)
      debounced.value = search.value
    }, 560)
    return () => clearTimeout(timeoutId)
  }, [search.value])


const { data,isLoading } = useGetAgentListings({
  id: agentId,
  enabled: !!agentId,
  page,
  limit,
  school:debounced.value,
  location: debounced.value,
})
const {data:paymentData,isLoading:paymentLoading} = useGetAgentPayments({userId,enabled:!!userId})
  
  const mapCards = data?.listings?.map((item:CardProps['listing']) => {
  return <Card
  key={item._id} listing={item}
  isAgentCard={true}
  edit={selected === 'edit' && true} />
  })


  return (
    <>
    <Payments
    data={paymentData}
    isLoading={paymentLoading} />
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
    
    {!showAdd ?  '' : <div className="addListing dark:text-white">
      <Link href={'/agent/listings/add'}>
    <Image
     className="clickable"
     src={darkMode ? '/icons/addDark.svg'  : '/icons/add.svg'}
     width={50}
     height={50}
     alt="add"
     />
      </Link>
        <span>Add New Listing</span>
      </div>}
     
   <Searchbar
   search={search.value}
   setSearch={(e: React.ChangeEvent<HTMLInputElement>) => search.value = e.target.value}
   className='dark:text-white mt-[-19px] gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]'
   placeholder={"Search for your listings"}
   />
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