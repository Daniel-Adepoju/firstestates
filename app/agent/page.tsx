'use client'
import Card from "@components/Card"
import Agent from '@components/agent/Agent'
import { useEffect, useState } from "react"
import {Skeleton} from "@components/ui/skeleton"
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
import { useChangeHash } from "@lib/useIntersection"
import { PlusCircle } from "lucide-react"
import { formatNumber } from "@utils/formatNumber"

const AgentOnboarding = () => {
  useSignals()
  const {session} = useUser()
  const userId = session?.user.email
  const {darkMode} = useDarkMode()
  const params = useSearchParams()
  const limit = 10
  const page = params.get('page') || '1'
  const [selected, setSelected] = useState('edit') 
  const [agentId,setAgentId] = useState("")
  const [search, setSearch] = useState<string>("")
  const debounced = useSignal("")
  const searchParams = new URLSearchParams(params.toString())
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
 const [numOfListings,setNumOfListings] = useState()
 const [rentings,setRentings] = useState()

  useEffect(() => {
    if (session?.user.id && !agentId) {
      setAgentId(session.user.id)
    }
    setShowAdd(true)
  }, [session, agentId])


useEffect(() => {
    const timeoutId= setTimeout(() => {
       searchParams.set('page', '1')
       if(search) {
       router.push(`?${searchParams.toString()}#listings`)
       }
       debounced.value = search ?? ""
    }, 560)
    return () => clearTimeout(timeoutId)
  }, [search])


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

  useEffect(() => {
    if (data?.listings) {
      setNumOfListings(data.currentListings)
      setRentings(data.currentRentings)
    }

  }, [isLoading])



  const hashRef = useChangeHash()

  return (
    <>
      <div ref={hashRef} id='agent'
        className="w-full flex flex-col items-center gap-4">
        <Agent
          agent={session?.user}
        />

        <Payments
          data={paymentData}
          isLoading={paymentLoading} />

        <div className="adminDashboard_content grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4 dark:text-white self-center">
          <div className="content_item banner full">
            <h3>Renting</h3>
            <div className="text">
              <span>{formatNumber(data?.currentRentings ?? '0')}</span>
            </div>
          </div>

          <div className="content_item banner full">
            <h3>Current Listings</h3>
            <div className="text">
              <span>{formatNumber(data?.currentListings ?? '0')}</span>
            </div>
          </div>

         
        </div>

        {!showAdd ? '' : <div
          className="addListing dark:text-white">
          <Link
            className="rounded-full"
            href={'/agent/listings/add'}>
            <PlusCircle size={50}
              color='white'
              className='mediumScale rounded-full p-1 shadow-xs bg-[#045aa0] dark:bg-[#f29829e7]' />
          </Link>
          <span>Add New Listing</span>
        </div>}

        <div
          className="w-full flex flex-col items-center gap-4"
        >
          <Searchbar
            search={search}
            setSearch={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value)
            }}
            className='dark:text-white mt-[-19px] gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]'
            placeholder={"Search for your listings"}
          />
          <div ref={hashRef} id='listings' className="availableLists">
            <div className="header">
              <div onClick={() => setSelected('view')} className={`${selected === 'view' && 'active'} subheading`}>View Listings</div>
              <div onClick={() => setSelected('edit')} className={`${selected === 'edit' && 'active'} subheading`}>Edit Listings</div>
            </div>
            {!session || isLoading ? (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => {
                  return (
                    <Skeleton
                      key={i}
                      className="w-70 h-70 bg-gray-500/20 animate-none" />
                  )
                })}
              </div>
            )
              : mapCards
            }
          </div>
        </div>

        <Pagination
          currentPage={Number(data?.cursor)}
          totalPages={Number(data?.numOfPages)}
          hashParams='#listings'
        />
      </div>
    </>
  )
}

export default AgentOnboarding