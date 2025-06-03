'use client'
import Card from "./Card"
import Searchbar from "./Searchbar"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import {Loader} from "@utils/loaders"
import { CardProps } from "./Card"
import {useGetListings} from "@lib/customApi"
import { useRouter, useSearchParams } from "next/navigation"
import PopularThisWeek from "./PopularThisWeek"
import Filter from './Filter'
import { Skeleton } from "./ui/skeleton"
import Image from "next/image"
import { useUser } from "@utils/user"
import Pagination from './Pagination'

const CardList = () => {
useSignals()
const {session} = useUser()
const limit = useSignal(10)
const page = useSearchParams().get('page') || '1'
const location = useSignal("")
const school = useSignal("")
const price = useSignal("")
const active = useSignal(false)
const router = useRouter()
const placeholder = useSignal<string>('Search by school or location')
const search = useSignal('')

// useEffect(() => {
//   if(session) {
//    school.value = session?.user.school
//   }
// },[session])

const {data,isLoading,isError} = useGetListings({
  limit: limit.value,
  page: page,
  location: location.value,
  school: school.value,
  price: price.value,
})

 
 const mapCards = data?.posts?.map((item:CardProps['listing']) => {
return <Card key={item._id} listing={item} edit={false} />
})

if(isError) {
   return (
    <div className="card">Failed</div>
   )
}

  return (
    <>
    <div className="w-full flex flex-col justify-center items-center md:items-end md:pr-2">
   <Searchbar
   search={search.value}
   setSearch={() => search.value = ''}
   placeholder={placeholder.value}
   goToSearch={() => {
    placeholder.value = 'Redirecting to search page...'
    router.push('/search')
  }}/>

 <div 
    onClick={() => active.value =!active.value}
    className="dark:bg-gray-600 flex items-center justify-between bg-white w-80 border-1
     border-gray-400 p-1.5 px-2 shadow my-4 cursor-pointer rounded-sm">
       <span>Filter</span>
    <Image
    src={`/icons/${active.value ?'upTriangle.svg':'downTriangle.svg'}`}
    alt='icon'
    className={`triangle ${active.value && 'active'} dark:bg-white`}
    width={20}
    height={20}
    
    />
        </div>
    </div>

<Filter
selectedSchool={school}
selectedArea={location}
selectedPrice={price}
active={active.value}
/>   
<PopularThisWeek/>

   {isLoading ? <Skeleton className="w-[80%] m-4 h-1 mx-auto bg-blue-200"/> :
   <div className='flex flex-col items-center capitalize subheading p-1 mx-auto'>
    <div>Showing Recent Listings</div> 
    <div>From {school.value? school.value : 'all schools'}</div>
    </div>}
    <div className="card_list">
   {isLoading ?  <Loader className='my-18'/> : mapCards}
   {data?.posts.length < 1 &&
   <div className="flex items-center error m-6 text-2xl">
    <Image
    src="/icons/noListings.svg"
    width={100}
    height={100}
    alt='icon' />
   <div> No Listing Available</div>
    </div>}

    </div>
   {!isLoading && <Pagination
   currentPage={Number(data?.cursor)}
   totalPages={Number(data?.numOfPages)}/>}

   

   </>
  )
}

export default CardList
