'use client'
import Card from "./Card"
import Searchbar from "./Searchbar"
import { useSignal, useSignals } from "@preact/signals-react/runtime"
import {Loader} from "@utils/loaders"
import { CardProps } from "./Card"
import {useGetListings} from "@lib/customApi"
import { useRouter } from "next/navigation"
import PopularThisWeek from "./PopularThisWeek"
import Filter from './Filter'
import { Skeleton } from "./ui/skeleton"
import Image from "next/image"
const CardList = () => {
useSignals()
const limit = useSignal(10)
const page = useSignal(1)
const location = useSignal("")
const school = useSignal("")
const price = useSignal("")
const active = useSignal(false)
const router = useRouter()


const {data,isLoading,isError} = useGetListings({
  limit: limit.value,
  page: page.value,
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
goToSearch={() => router.push('/search')}/>

 <div 
    onClick={() => active.value =!active.value}
    className=" flex items-center justify-between bg-white w-80 border-1 border-gray-400 p-1.5 px-2 shadow my-4 cursor-pointer">
       <span>Filter</span>
    <Image
    src={`/icons/${active.value ?'upTriangle.svg':'downTriangle.svg'}`}
    alt='icon'
    className={`triangle ${active.value && 'active'}`}
    width={20}
    height={20} />
        </div>
    </div>

<Filter
selectedSchool={school}
selectedArea={location}
selectedPrice={price}
active={active.value}
/>   
<PopularThisWeek/>

   {isLoading ? <Skeleton className="w-[80%] m-4 h-1 mx-auto bg-blue-600"/> :
   <div className='capitalize subheading p-1 mx-auto smallLine'>
    Showing Recent Listings From {school.value? school.value : 'all schools'}
    </div>}
    <div className="card_list">
   {isLoading ?  <Loader className='my-20' /> : mapCards}
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
       </>
  )
}

export default CardList
