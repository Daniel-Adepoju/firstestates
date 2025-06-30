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
import Featured from "./Featured"
import Link from "next/link"
import { ArrowLeftFromLine } from "lucide-react"

const CardList = () => {
useSignals()
const {session} = useUser()
const limit = useSignal(10)
const page = useSearchParams().get('page') || '1'
const location = useSignal("")
const school = useSignal("")
const minPrice = useSignal("")
const maxPrice = useSignal("")
const active = useSignal(false)
const router = useRouter()
const placeholder = useSignal<string>('Search by school or location')
const search = useSignal('')
const beds = useSignal('')
const baths = useSignal('')
const toilets = useSignal('')
 const currentPage = useSearchParams().get('page')
 const isSecondPage = Number(currentPage) >= 2
const current = useSignal(false)

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
  minPrice: minPrice.value,
  maxPrice: maxPrice.value,
  beds: beds.value,
  baths: baths.value,
  toilets: toilets.value,

})

 
 const mapCards = data?.posts?.map((item:CardProps['listing']) => {
return <Card key={item._id} listing={item} edit={false} />
})

const loadingCards = Array.from({length:6}).map((_,i) => {
  return <Skeleton className="animate-none bg-gray-500/20 w-80 h-80" key={i} />
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
   className={`mt-[0px] gap-1 w-full flex flex-row justify-center items-center md:justify-end  md:w-[60%]`}
   goToSearch={() => {
    placeholder.value = 'Redirecting to search page...'
    router.push('/search')
  }}/>
 <div 
    onClick={() => active.value =!active.value}
    className="dark:bg-gray-600 flex items-center justify-between bg-white w-80 border-1
     border-gray-400 p-2 px-2 shadow my-4 cursor-pointer rounded-sm">
       <span>Filter</span>
    <Image
    src={`/icons/${active.value ?'upTriangle.svg':'downTriangle.svg'}`}
    alt='icon'
    className={`triangle ${active.value && 'active'} rounded-sm dark:bg-white`}
    width={20}
    height={20}
    
    />
        </div>
    </div>

<Filter
selectedSchool={school}
selectedArea={location}
minPrice={minPrice}
maxPrice={maxPrice}
beds={beds}
baths={baths}
toilets={toilets}
active={active}
/>   
{!isSecondPage ? (
  <>
    <PopularThisWeek/>
    <Featured />
  </>
) : (
  !isLoading && <Link
  href="/"
  className="flex flex-row gap-2 
  mt-2  mx-1 px-4 py-1.5 items-center self-center md:self-end
  dark:text-gray-400 text-gray-500  transition-all
  dark:bg-gray-600 bg-gray-200 rounded-lg
   hover:text-gray-900 dark:hover:text-gray-200"
   >
  <ArrowLeftFromLine size={30} />
  Return To Homepage
</Link>
)}
   {isLoading ? <Skeleton className="w-[80%] m-4 h-1 mx-auto bg-gray-500/20"/> :
   <div className='flex flex-col items-center capitalize subheading p-1 mx-auto'>
    <div>Showing Recent Listings</div> 
    <div className="middleLine text-center">From {school.value? school.value : 'all schools'}</div>
    </div>}
    <div className="card_list">
   {isLoading ? 
   <div className="mx-auto my-4 items-center justify-center flex flex-wrap gap-10">
   {loadingCards}
   </div>
   : mapCards}
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
